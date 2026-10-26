"""Service web Wan2.2 (image vers video) pour LibreChat, sur Modal.

Deploiement :  modal deploy wan_video_api.py
Secret requis : un secret Modal nomme "wan-api-key" contenant WAN_API_KEY=<votre cle>.

Utilisation dans LibreChat : joindre la photo du personnage, ecrire une scene par
paragraphe (ligne vide entre deux scenes). Chaque scene dure 5 s (modele wan-5s) ou
10 s (wan-10s). La reponse contient un lien ; la video est prete en quelques minutes.
"""
import base64
import io
import json
import os
import re
import urllib.request
import uuid

import modal

app = modal.App("wan-video")

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
        "fastapi[standard]",
        "huggingface_hub[hf_transfer]",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "HF_HOME": "/models"})
)

models = modal.Volume.from_name("wan-models", create_if_missing=True)
outputs = modal.Volume.from_name("wan-outputs", create_if_missing=True)

BASE = "Wan-AI/Wan2.2-I2V-A14B-Diffusers"
LORA = "lightx2v/Wan2.2-Lightning"
LORA_DIR = "Wan2.2-I2V-A14B-4steps-lora-rank64-Seko-V1"
MODELS = {"wan-5s": 81, "wan-10s": 161}
MAX_SCENES = 12
SUFFIX = ", realistic, natural motion, sharp details"


# ---------- logique pure (testable sans GPU) ----------
def split_scenes(text):
    parts = [p.strip() for p in re.split(r"\n\s*\n", (text or "").strip())]
    return [p for p in parts if p][:MAX_SCENES]


def parse_request(body):
    """Renvoie (texte du dernier message, liste d'images) a partir du format OpenAI."""
    texts, images = [], []
    msgs = body.get("messages") or []
    last_done = False
    for m in reversed(msgs):
        if m.get("role") != "user":
            continue
        content = m.get("content")
        found = []
        if isinstance(content, str):
            if not last_done:
                texts.append(content)
        elif isinstance(content, list):
            for p in content:
                if p.get("type") == "text" and not last_done:
                    texts.append(p.get("text", ""))
                elif p.get("type") == "image_url":
                    u = p.get("image_url")
                    u = u.get("url") if isinstance(u, dict) else u
                    if u:
                        found.append(u)
        images.extend(found)
        last_done = True
        if images:
            break
    return "\n\n".join(t for t in texts if t), images


def load_image_bytes(url):
    if url.startswith("data:"):
        return base64.b64decode(url.split(",", 1)[1])
    with urllib.request.urlopen(url, timeout=60) as r:
        return r.read()


def reply_payload(job, model, text):
    return {
        "id": "chatcmpl-" + job,
        "object": "chat.completion",
        "created": 0,
        "model": model,
        "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
    }


def sse_chunks(job, model, text):
    base = {"id": "chatcmpl-" + job, "object": "chat.completion.chunk", "created": 0, "model": model}
    first = dict(base, choices=[{"index": 0, "delta": {"role": "assistant", "content": ""}, "finish_reason": None}])
    body = dict(base, choices=[{"index": 0, "delta": {"content": text}, "finish_reason": None}])
    end = dict(base, choices=[{"index": 0, "delta": {}, "finish_reason": "stop"}])
    for c in (first, body, end):
        yield "data: " + json.dumps(c) + "\n\n"
    yield "data: [DONE]\n\n"


def handle_chat(body, auth, key, base_url, launch):
    """Renvoie (statut, texte de reponse, nom du modele, id de la tache)."""
    if not key or auth != "Bearer " + key:
        return 401, "Cle invalide.", "", ""
    model = body.get("model") or "wan-5s"
    frames = MODELS.get(model, 81)
    text, urls = parse_request(body)
    scenes = split_scenes(text)
    job = uuid.uuid4().hex
    if not urls:
        return 200, "Joignez d'abord la photo du personnage (image), puis renvoyez le texte.", model, job
    if not scenes:
        return 200, "Ecrivez au moins une scene (un paragraphe par scene).", model, job
    try:
        raw = load_image_bytes(urls[0])
    except Exception as e:  # image illisible
        return 200, "Image illisible : " + str(e)[:120], model, job
    launch(job, raw, [s + SUFFIX for s in scenes], frames)
    seconds = round(frames / 16)
    eta = max(3, 2 * len(scenes))
    msg = (
        "Video lancee : %d scene(s) de %d s (environ %d s au total, sans son).\n"
        "Prete dans environ %d minutes (davantage si le serveur demarre a froid).\n"
        "Lien : %s/v/%s.mp4\n"
        "Tant que la video n'est pas prete, le lien affiche l'avancement."
    ) % (len(scenes), seconds, seconds * len(scenes), eta, base_url, job)
    return 200, msg, model, job


# ---------- GPU ----------
@app.cls(
    image=image,
    gpu="H100",
    volumes={"/models": models, "/out": outputs},
    timeout=3600,
    scaledown_window=300,
    memory=65536,
    max_containers=1,
)
class Wan:
    @modal.enter()
    def load(self):
        import torch
        from diffusers import AutoencoderKLWan, FlowMatchEulerDiscreteScheduler, WanImageToVideoPipeline

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
        self.pipe = pipe
        models.commit()

    def _status(self, job, **kw):
        with open("/out/%s.json" % job, "w") as f:
            json.dump(kw, f)
        outputs.commit()

    @modal.method()
    def render(self, job: str, image_bytes: bytes, prompts: list, num_frames: int):
        import subprocess
        import tempfile

        import torch
        from diffusers.utils import export_to_video
        from PIL import Image

        width, height = 832, 480
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        target = width / height
        w, h = img.size
        if w / h > target:
            nw = int(h * target)
            img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = int(w / target)
            img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        img = img.resize((width, height), Image.LANCZOS)

        total = len(prompts)
        try:
            with tempfile.TemporaryDirectory() as tmp:
                clips = []
                for i, prompt in enumerate(prompts):
                    self._status(job, state="running", done=i, total=total)
                    frames = self.pipe(
                        image=img,
                        prompt=prompt,
                        height=height,
                        width=width,
                        num_frames=num_frames,
                        guidance_scale=1.0,
                        guidance_scale_2=1.0,
                        num_inference_steps=4,
                        generator=torch.Generator("cuda").manual_seed(42 + i),
                    ).frames[0]
                    path = "%s/clip%d.mp4" % (tmp, i)
                    export_to_video(frames, path, fps=16)
                    clips.append(path)
                listing = tmp + "/list.txt"
                with open(listing, "w") as f:
                    for c in clips:
                        f.write("file '%s'\n" % c)
                final = tmp + "/final.mp4"
                subprocess.run(
                    ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", listing, "-c", "copy", final],
                    check=True,
                    capture_output=True,
                )
                with open(final, "rb") as src, open("/out/%s.mp4" % job, "wb") as dst:
                    dst.write(src.read())
            self._status(job, state="done", done=total, total=total)
        except Exception as e:
            self._status(job, state="error", message=str(e)[:300])
            raise


# ---------- web ----------
@app.function(
    image=image,
    secrets=[modal.Secret.from_name("wan-api-key")],
    volumes={"/out": outputs},
    timeout=300,
)
@modal.asgi_app(label="wan-video")
def web():
    from fastapi import FastAPI, Request
    from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
    from PIL import Image

    api = FastAPI()

    def launch(job, raw, prompts, frames):
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        img.thumbnail((1280, 1280))
        buf = io.BytesIO()
        img.save(buf, "JPEG", quality=92)
        Wan().render.spawn(job, buf.getvalue(), prompts, frames)

    @api.get("/v1/models")
    def list_models():
        return {"object": "list", "data": [{"id": m, "object": "model"} for m in MODELS]}

    @api.post("/v1/chat/completions")
    async def chat(request: Request):
        try:
            body = await request.json()
        except Exception:
            return JSONResponse({"error": {"message": "JSON invalide"}}, status_code=400)
        base_url = str(request.base_url).rstrip("/").replace("http://", "https://")
        status, text, model, job = handle_chat(
            body, request.headers.get("authorization", ""), os.environ.get("WAN_API_KEY", ""), base_url, launch
        )
        if status != 200:
            return JSONResponse({"error": {"message": text}}, status_code=status)
        if body.get("stream"):
            return StreamingResponse(sse_chunks(job, model, text), media_type="text/event-stream")
        return JSONResponse(reply_payload(job, model, text))

    @api.get("/v/{job}.mp4")
    def video(job: str):
        if not re.fullmatch(r"[a-f0-9]{32}", job):
            return JSONResponse({"error": "identifiant invalide"}, status_code=400)
        outputs.reload()
        mp4 = "/out/%s.mp4" % job
        if os.path.exists(mp4):
            return FileResponse(mp4, media_type="video/mp4")
        st = "/out/%s.json" % job
        if os.path.exists(st):
            with open(st) as f:
                return JSONResponse(json.load(f), status_code=202)
        return JSONResponse({"state": "inconnu"}, status_code=404)

    return api
