/* ============================================================
   crop.js - 증명사진 · 여권사진 규격 크롭
   - 용도별 프리셋 (여권/이력서/비자/신분증/직접지정)
   - 점선 가이드 박스 드래그 이동 + 모서리 리사이즈
   - 목적 픽셀로 리샘플 + 품질 슬라이더로 용량 최적화
   ============================================================ */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const el = {
    dropzone: $("#cropDropzone"),
    fileInput: $("#cropFileInput"),
    presetGroup: $("#presetGroup"),
    customBox: $("#customPresetBox"),
    cropW: $("#cropW"),
    cropH: $("#cropH"),
    stage: $("#cropStage"),
    wrap: $("#cropCanvasWrap"),
    canvas: $("#cropCanvas"),
    guide: $("#cropGuide"),
    quality: $("#cropQuality"),
    qualityValue: $("#cropQualityValue"),
    formatGroup: $("#cropFormatGroup"),
    downloadBtn: $("#cropDownloadBtn"),
    hint: $("#cropHint")
  };

  const state = {
    img: null,              // HTMLImageElement (디코드된 원본)
    fileName: "photo",
    preset: "passport",
    targetW: 413,
    targetH: 531,
    quality: 85,
    format: "jpeg",
    box: { x: 0, y: 0, w: 0, h: 0 }, // 캔버스(표시 축척) 기준 가이드 박스
    scale: 1,               // 표시 축척 = 원본/표시
    drag: null              // {mode, startX, startY, orig}
  };

  const fmtBytes = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(2) + " MB";
  };

  /* ----------------------------------------------------------------
     파일 로드
  ---------------------------------------------------------------- */
  function handleFile(file) {
    if (!file || !/^image\//.test(file.type)) {
      el.hint.textContent = window.I18n ? window.I18n.t("crop.msg.only.image") : "⚠️ Only image files are supported.";
      el.hint.style.color = "var(--c-err)";
      return;
    }
    el.hint.textContent = window.I18n ? window.I18n.t("crop.privacy") : "🔒 Photos are processed locally in your browser only.";
    el.hint.style.color = "";
    state.fileName = file.name.replace(/\.[^.]+$/, "") || "photo";

    // HEIC는 우선 PNG로 디코드
    const isHeic = /heic|heif/i.test(file.type) || /\.heic|\.heif/i.test(file.name);
    if (isHeic && window.heic2any) {
      window.heic2any({ blob: file, toType: "image/png" }).then((b) => loadImg(URL.createObjectURL(b)));
      return;
    }
    if (isHeic) {
      const s = document.createElement("script");
      s.src = "js/libs/heic2any.min.js";
      s.onload = () => window.heic2any({ blob: file, toType: "image/png" })
        .then((b) => loadImg(URL.createObjectURL(b)));
      document.head.appendChild(s);
      return;
    }
    loadImg(URL.createObjectURL(file));
  }

  function loadImg(url) {
    const img = new Image();
    img.onload = () => {
      state.img = img;
      renderStage();
      el.downloadBtn.disabled = false;
    };
    img.onerror = () => {
      el.hint.textContent = window.I18n ? window.I18n.t("crop.msg.load.fail") : "⚠️ Failed to load this photo. Please try another.";
      el.hint.style.color = "var(--c-err)";
    };
    img.src = url;
  }

  /* ----------------------------------------------------------------
     스테이지 렌더링 (캔버스 + 가이드)
  ---------------------------------------------------------------- */
  function renderStage() {
    if (!state.img) return;
    const img = state.img;
    const maxW = Math.max(200, el.stage.clientWidth - 28);
    const maxH = 420;

    let dispW = img.naturalWidth;
    let dispH = img.naturalHeight;
    const fit = Math.min(maxW / dispW, maxH / dispH, 1);
    dispW = Math.max(1, Math.round(dispW * fit));
    dispH = Math.max(1, Math.round(dispH * fit));
    state.scale = img.naturalWidth / dispW;

    const c = el.canvas;
    c.width = dispW;
    c.height = dispH;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, dispW, dispH);
    ctx.drawImage(img, 0, 0, dispW, dispH);

    el.stage.querySelectorAll(".crop-empty").forEach((n) => n.remove());
    el.wrap.classList.remove("hidden");

    // 가이드 초기 위치: 목적 비율로 최대한 크게 중앙 배치
    const ratio = state.targetW / state.targetH;
    let bw = dispW * 0.72;
    let bh = bw / ratio;
    if (bh > dispH * 0.92) {
      bh = dispH * 0.92;
      bw = bh * ratio;
    }
    state.box = {
      x: (dispW - bw) / 2,
      y: (dispH - bh) / 2,
      w: bw,
      h: bh
    };
    positionGuide();
  }

  function positionGuide() {
    const b = state.box;
    el.guide.style.left = b.x + "px";
    el.guide.style.top = b.y + "px";
    el.guide.style.width = b.w + "px";
    el.guide.style.height = b.h + "px";
  }

  /* ----------------------------------------------------------------
     드래그 (이동 + 8방향 리사이즈)
  ---------------------------------------------------------------- */
  function bindDrag() {
    el.guide.addEventListener("pointerdown", (e) => {
      if (!state.img) return;
      e.preventDefault();
      const mode = e.target.classList.contains("handle") ? e.target.dataset.h : "move";
      state.drag = {
        mode: mode,
        sx: e.clientX,
        sy: e.clientY,
        orig: Object.assign({}, state.box)
      };
      el.guide.setPointerCapture(e.pointerId);
    });

    el.guide.addEventListener("pointermove", (e) => {
      if (!state.drag || !state.img) return;
      const rect = el.canvas.getBoundingClientRect();
      const dx = e.clientX - state.drag.sx;
      const dy = e.clientY - state.drag.sy;
      const o = state.drag.orig;
      let { x, y, w, h } = o;
      const ratio = state.targetW / state.targetH;
      const minW = 24;
      const minH = minW / ratio;

      const m = state.drag.mode;
      if (m === "move") {
        x = o.x + dx;
        y = o.y + dy;
      } else {
        // 리사이즈: 비율 고정
        if (m.indexOf("e") !== -1) w = o.w + dx;
        if (m.indexOf("s") !== -1) h = o.h + dy;
        if (m.indexOf("w") !== -1) { w = o.w - dx; x = o.x + dx; }
        if (m.indexOf("n") !== -1) { h = o.h - dy; y = o.y + dy; }
        // 종횡비 유지
        const newW = Math.max(minW, h * ratio);
        const newH = newW / ratio;
        if (m.indexOf("w") !== -1) x = o.x + (o.w - newW);
        if (m.indexOf("n") !== -1) y = o.y + (o.h - newH);
        w = newW;
        h = newH;
      }

      const cw = el.canvas.width;
      const ch = el.canvas.height;
      if (w > cw) { w = cw; h = w / ratio; }
      if (h > ch) { h = ch; w = h * ratio; }
      x = Math.max(0, Math.min(x, cw - w));
      y = Math.max(0, Math.min(y, ch - h));

      state.box = { x: x, y: y, w: w, h: h };
      positionGuide();
    });

    const end = () => { state.drag = null; };
    el.guide.addEventListener("pointerup", end);
    el.guide.addEventListener("pointercancel", end);
  }

  /* ----------------------------------------------------------------
     출력 (리샘플 + 압축)
  ---------------------------------------------------------------- */
  function mimeFor(fmt) {
    return ({ jpeg: "image/jpeg", png: "image/png", webp: "image/webp" })[fmt] || "image/jpeg";
  }

  function buildOutput() {
    if (!state.img) return null;
    const img = state.img;
    const sc = state.scale;

    // 캔버스 좌표 → 원본 픽셀
    const sx = state.box.x * sc;
    const sy = state.box.y * sc;
    const sw = Math.max(1, state.box.w * sc);
    const sh = Math.max(1, state.box.h * sc);

    const out = document.createElement("canvas");
    out.width = state.targetW;
    out.height = state.targetH;
    const ctx = out.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 출력이 세로/가로 비율이 입력 영역과 다르면 object-fit: cover 처럼 채움
    const inRatio = sw / sh;
    const outRatio = state.targetW / state.targetH;
    let drawW = state.targetW;
    let drawH = state.targetH;
    let drawX = 0;
    let drawY = 0;
    if (inRatio > outRatio) {
      drawW = state.targetH * inRatio;
      drawX = -(drawW - state.targetW) / 2;
    } else {
      drawH = state.targetW / inRatio;
      drawY = -(drawH - state.targetH) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, drawX, drawY, drawW, drawH);

    return new Promise((resolve, reject) => {
      out.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        mimeFor(state.format),
        state.format === "png" ? undefined : state.quality / 100
      );
    });
  }

  function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function run() {
    if (!state.img) return;
    el.downloadBtn.disabled = true;
    el.downloadBtn.textContent = window.I18n ? window.I18n.t("crop.msg.cropping") : "✂️ Cropping...";
    try {
      const blob = await buildOutput();
      const ext = state.format === "jpeg" ? "jpg" : state.format;
      download(blob, state.fileName + "-" + state.preset + "-" + state.targetW + "x" + state.targetH + "." + ext);
      el.hint.textContent = window.I18n
        ? window.I18n.t("crop.msg.done", { w: state.targetW, h: state.targetH, size: fmtBytes(blob.size) })
        : "✅ Done! " + state.targetW + "×" + state.targetH + "px · " + fmtBytes(blob.size);
      el.hint.style.color = "var(--c-ok)";
    } catch (e) {
      el.hint.textContent = window.I18n ? window.I18n.t("crop.msg.crop.fail") : "⚠️ Failed to crop. Please try again.";
      el.hint.style.color = "var(--c-err)";
    } finally {
      el.downloadBtn.disabled = false;
      el.downloadBtn.textContent = window.I18n ? window.I18n.t("crop.download") : "✂️ Crop & Download";
    }
  }

  /* ----------------------------------------------------------------
     프리셋
  ---------------------------------------------------------------- */
  function setPreset(btn) {
    state.preset = btn.dataset.preset;
    const w = parseInt(btn.dataset.w, 10) || 0;
    const h = parseInt(btn.dataset.h, 10) || 0;
    $$("#presetGroup .preset").forEach((b) => b.classList.toggle("active", b === btn));

    if (state.preset === "custom") {
      el.customBox.classList.remove("hidden");
      state.targetW = parseInt(el.cropW.value, 10) || 413;
      state.targetH = parseInt(el.cropH.value, 10) || 531;
    } else {
      el.customBox.classList.add("hidden");
      state.targetW = w;
      state.targetH = h;
    }
    if (state.img) renderStage();
  }

  function bind() {
    // dropzone
    el.dropzone.addEventListener("click", () => el.fileInput.click());
    el.dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.fileInput.click(); }
    });
    ["dragenter", "dragover"].forEach((ev) =>
      el.dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); el.dropzone.classList.add("dragging"); })
    );
    ["dragleave", "drop"].forEach((ev) =>
      el.dropzone.addEventListener(ev, (e) => { e.preventDefault(); e.stopPropagation(); el.dropzone.classList.remove("dragging"); })
    );
    el.dropzone.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
    el.fileInput.addEventListener("change", (e) => {
      if (e.target.files[0]) handleFile(e.target.files[0]);
      e.target.value = "";
    });

    // presets
    el.presetGroup.addEventListener("click", (e) => {
      const b = e.target.closest(".preset");
      if (b) setPreset(b);
    });
    el.cropW.addEventListener("change", () => {
      state.targetW = parseInt(el.cropW.value, 10) || 413;
      if (state.img) renderStage();
    });
    el.cropH.addEventListener("change", () => {
      state.targetH = parseInt(el.cropH.value, 10) || 531;
      if (state.img) renderStage();
    });

    // quality / format
    el.quality.addEventListener("input", () => {
      state.quality = parseInt(el.quality.value, 10);
      el.qualityValue.textContent = state.quality + "%";
    });
    el.formatGroup.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cfmt]");
      if (!b) return;
      state.format = b.dataset.cfmt;
      $$("#cropFormatGroup .seg__btn").forEach((x) => x.classList.toggle("active", x === b));
    });

    // download
    el.downloadBtn.addEventListener("click", run);

    // drag
    bindDrag();

    // resize re-render
    let rTimer = null;
    window.addEventListener("resize", () => {
      if (!state.img) return;
      clearTimeout(rTimer);
      rTimer = setTimeout(renderStage, 180);
    });
  }

  // 리사이즈 핸들 8개를 가이드에 주입
  function injectHandles() {
    const dirs = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
    el.guide.innerHTML = dirs
      .map(
        (d) =>
          '<span class="handle" data-h="' + d + '" style="position:absolute;width:12px;height:12px;background:#fff;border:2px solid var(--c-primary);border-radius:50%;' +
          handlePos(d) + 'z-index:2;"></span>'
      )
      .join("");
  }
  function handlePos(d) {
    const p = {
      n: "left:50%;top:-6px;transform:translateX(-50%);cursor:ns-resize;",
      s: "left:50%;bottom:-6px;transform:translateX(-50%);cursor:ns-resize;",
      e: "right:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize;",
      w: "left:-6px;top:50%;transform:translateY(-50%);cursor:ew-resize;",
      ne: "right:-6px;top:-6px;cursor:nesw-resize;",
      nw: "left:-6px;top:-6px;cursor:nwse-resize;",
      se: "right:-6px;bottom:-6px;cursor:nwse-resize;",
      sw: "left:-6px;bottom:-6px;cursor:nesw-resize;"
    };
    return p[d] || "";
  }

  injectHandles();
  bind();

  window.crop = {
    onLangChange() {
      if (!state.img) {
        el.hint.textContent = window.I18n.t("crop.privacy");
      }
      el.downloadBtn.textContent = window.I18n.t("crop.download");
    }
  };
})();
