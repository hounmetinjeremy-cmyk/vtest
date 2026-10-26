"""Test Wan2.2 image vers video (4 etapes, LoRA LightX2V) sur Modal.

Lancer :  modal run wan_i2v_test.py --image-url "https://..." --prompt "..."
Resultat : fichier wan_test.mp4 (16 images par seconde ; 81 images = environ 5 s).
"""
import io

import modal

app = modal.App("wan-i2v-test")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("ffmpeg")
    .pip_install(
        "torch==2.7.1",
        "diffusers>=0.35.0",
        "transformers",
        "accelerate",
        "peft",
        "ftfy",
        "imageio",
        "imageio-ffmpeg",
        "safetensors",
        "sentencepiece",
        "requests",
        "pillow",
        "huggingface_hub[hf_transfer]",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "HF_HOME": "/models"})
)

models = modal.Volume.from_name("wan-models", create_if_missing=True)

BASE = "Wan-AI/Wan2.2-I2V-A14B-Diffusers"
LORA = "lightx2v/Wan2.2-Lightning"
LORA_DIR = "Wan2.2-I2V-A14B-4steps-lora-rank64-Seko-V1"


def fit(img, width, height):
    """Recadre l'image au bon format puis la redimensionne."""
    from PIL import Image

    img = img.convert("RGB")
    target = width / height
    w, h = img.size
    if w / h > target:
        new_w = int(h * target)
        left = (w - new_w) // 2
        img = img.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target)
        top = (h - new_h) // 2
        img = img.crop((0, top, w, top + new_h))
    return img.resize((width, height), Image.LANCZOS)


@app.function(image=image, gpu="H100", volumes={"/models": models}, timeout=3600)
def generate(image_url: str, prompt: str, width: int, height: int, num_frames: int, seed: int) -> bytes:
    import tempfile

    import requests
    import torch
    from diffusers import AutoencoderKLWan, FlowMatchEulerDiscreteScheduler, WanImageToVideoPipeline
    from diffusers.utils import export_to_video
    from PIL import Image

    vae = AutoencoderKLWan.from_pretrained(BASE, subfolder="vae", torch_dtype=torch.float32)
    pipe = WanImageToVideoPipeline.from_pretrained(BASE, vae=vae, torch_dtype=torch.bfloat16)
    pipe.scheduler = FlowMatchEulerDiscreteScheduler.from_config(pipe.scheduler.config, shift=5.0)

    pipe.load_lora_weights(LORA, weight_name=LORA_DIR + "/high_noise_model.safetensors", adapter_name="high")
    pipe.load_lora_weights(
        LORA,
        weight_name=LORA_DIR + "/low_noise_model.safetensors",
        adapter_name="low",
        load_into_transformer_2=True,
    )
    pipe.set_adapters(["high", "low"], adapter_weights=[1.0, 1.0])
    pipe.enable_model_cpu_offload()
    models.commit()

    raw = requests.get(image_url, timeout=60).content
    img = fit(Image.open(io.BytesIO(raw)), width, height)

    frames = pipe(
        image=img,
        prompt=prompt,
        height=height,
        width=width,
        num_frames=num_frames,
        guidance_scale=1.0,
        guidance_scale_2=1.0,
        num_inference_steps=4,
        generator=torch.Generator("cuda").manual_seed(seed),
    ).frames[0]

    with tempfile.NamedTemporaryFile(suffix=".mp4") as f:
        export_to_video(frames, f.name, fps=16)
        return open(f.name, "rb").read()


@app.local_entrypoint()
def main(
    image_url: str,
    prompt: str = "the person is speaking naturally, looking at the camera, natural motion, realistic",
    width: int = 832,
    height: int = 480,
    num_frames: int = 81,
    seed: int = 42,
    out: str = "wan_test.mp4",
):
    data = generate.remote(image_url, prompt, width, height, num_frames, seed)
    with open(out, "wb") as f:
        f.write(data)
    print("OK :", out, len(data), "octets")
