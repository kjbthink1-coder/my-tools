/* ============================================================
   app.js - Image Converter core
   100% client-side. No server, no uploads.
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const MAX_FILES = 50;
  const LOSSLESS = ["png", "gif", "bmp"];           // quality slider N/A
  const NO_TRANSPARENCY = ["jpeg", "bmp"];          // need bg fill
  const SUPPORTED = ["png", "jpeg", "webp", "avif", "gif", "bmp", "ico", "heic", "heif", "tiff"];

  // Element refs
  const el = {
    dropzone: $("#dropzone"),
    fileInput: $("#fileInput"),
    formatGroup: $("#formatGroup"),
    formatNote: $("#formatNote"),
    quality: $("#quality"),
    qualityValue: $("#qualityValue"),
    qualityField: $("#qualityField"),
    ratioBox: $("#ratioBox"),
    customBox: $("#customBox"),
    ratioSel: $("#ratioSel"),
    dstW: $("#dstW"),
    dstH: $("#dstH"),
    keepAspect: $("#keepAspect"),
    fillBg: $("#fillBg"),
    bgColor: $("#bgColor"),
    convertBtn: $("#convertBtn"),
    convertCount: $("#convertCount"),
    fileListWrap: $("#fileListWrap"),
    fileList: $("#fileList"),
    fileCount: $("#fileCount"),
    clearBtn: $("#clearBtn"),
    batchBar: $("#batchBar"),
    totalStat: $("#totalStat"),
    downloadAll: $("#downloadAll"),
    zipCount: $("#zipCount"),
    downloadEach: $("#downloadEach"),
    toast: $("#toast"),
    overlay: $("#overlay"),
    overlayText: $("#overlayText"),
    langToggle: $("#langToggle")
  };

  // State
  const state = {
    files: [],            // [{id, file, name, kind, originalSize, status, outName, outBlob, outSize, thumbUrl, error}]
    nextId: 1,
    target: "webp",
    quality: 85,
    resize: "none",
    exif: "remove",
    converting: false
  };

  /* ------------------------------------------------------------------
     Utilities
  ------------------------------------------------------------------ */
  function t(key, vars) {
    return window.I18n ? window.I18n.t(key, vars) : key;
  }

  function toast(msg, kind) {
    el.toast.textContent = msg;
    el.toast.className = "toast show" + (kind ? " " + kind : "");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      el.toast.className = "toast";
    }, 2600);
  }

  function fmtBytes(bytes) {
    if (bytes === undefined || bytes === null) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function ext(name) {
    const m = /\.([a-z0-9]+)$/i.exec(name || "");
    return m ? m[1].toLowerCase() : "";
  }

  function baseName(name) {
    return (name || "").replace(/\.[^.]+$/, "");
  }

  function mimeFor(fmt) {
    return ({
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      gif: "image/gif",
      bmp: "image/bmp",
      ico: "image/x-icon"
    })[fmt] || "image/png";
  }

  function outExt(fmt) {
    return ({ jpeg: "jpg", png: "png", webp: "webp", avif: "avif", gif: "gif", bmp: "bmp", ico: "ico" })[fmt] || fmt;
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

  /* ------------------------------------------------------------------
     Format detection & decoding
  ------------------------------------------------------------------ */
  function detectKind(file) {
    const e = ext(file.name);
    if (e === "heic" || e === "heif") return "heic";
    if (e === "tif" || e === "tiff") return "tiff";
    if (SUPPORTED.indexOf(e) !== -1) return e;
    const tp = (file.type || "").toLowerCase();
    if (tp.indexOf("heic") !== -1 || tp.indexOf("heif") !== -1) return "heic";
    if (tp.indexOf("tiff") !== -1) return "tiff";
    if (tp.indexOf("png") !== -1) return "png";
    if (tp.indexOf("jpeg") !== -1 || tp.indexOf("jpg") !== -1) return "jpeg";
    if (tp.indexOf("webp") !== -1) return "webp";
    if (tp.indexOf("gif") !== -1) return "gif";
    if (tp.indexOf("bmp") !== -1) return "bmp";
    if (tp.indexOf("avif") !== -1) return "avif";
    if (tp.indexOf("icon") !== -1) return "ico";
    return null;
  }

  function loadImg(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objUrl = typeof src !== "string" ? URL.createObjectURL(src) : null;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = () => {
        if (objUrl) URL.revokeObjectURL(objUrl);
        reject(new Error("decode failed"));
      };
      img.src = objUrl || src;
    });
  }

  let heicPromise = null;
  function loadHeicLib() {
    if (window.heic2any) return Promise.resolve();
    if (heicPromise) return heicPromise;
    heicPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "js/libs/heic2any.min.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("heic lib load failed"));
      document.head.appendChild(s);
    });
    return heicPromise;
  }

  // Decode any supported file into an HTMLImageElement
  function decodeImage(item) {
    const kind = item.kind;

    if (kind === "heic" || kind === "heif") {
      return loadHeicLib()
        .then(() => window.heic2any({ blob: item.file, toType: "image/png", multiple: false }))
        .then((pngBlob) => {
          item.thumbUrl = URL.createObjectURL(pngBlob);
          return loadImg(pngBlob);
        });
    }

    // Native decode (png, jpeg, webp, gif, bmp, avif, tiff, ico)
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(item.file);
      const img = new Image();
      img.onload = () => {
        item.thumbUrl = url;
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("unsupported format: " + kind));
      };
      img.src = url;
    });
  }

  /* ------------------------------------------------------------------
     Canvas drawing
  ------------------------------------------------------------------ */
  function computeSize(w, h) {
    if (state.resize === "ratio") {
      const r = parseFloat(el.ratioSel.value) || 1;
      return { w: Math.max(1, Math.round(w * r)), h: Math.max(1, Math.round(h * r)) };
    }
    if (state.resize === "custom") {
      const dw = parseInt(el.dstW.value, 10);
      const dh = parseInt(el.dstH.value, 10);
      if (el.keepAspect.checked) {
        if (dw && !dh) return { w: dw, h: Math.max(1, Math.round((h * dw) / w)) };
        if (!dw && dh) return { w: Math.max(1, Math.round((w * dh) / h)), h: dh };
        if (dw && dh) {
          const r = Math.min(dw / w, dh / h);
          return { w: Math.max(1, Math.round(w * r)), h: Math.max(1, Math.round(h * r)) };
        }
        return { w: w, h: h };
      }
      return { w: dw || w, h: dh || h };
    }
    return { w: w, h: h };
  }

  function drawToCanvas(img, w, h, needFill) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (needFill) {
      ctx.fillStyle = el.bgColor.value || "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    return c;
  }

  /* ------------------------------------------------------------------
     EXIF handling (JPEG only)
  ------------------------------------------------------------------ */
  function readExifSegment(file) {
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => {
        const u = new Uint8Array(r.result);
        if (u.length < 4 || u[0] !== 0xff || u[1] !== 0xd8) { resolve(null); return; }
        let i = 2;
        while (i + 3 < u.length) {
          if (u[i] !== 0xff) { resolve(null); return; }
          const marker = u[i + 1];
          if (marker === 0xda) { resolve(null); return; } // SOS
          const len = (u[i + 2] << 8) | u[i + 3];
          if (marker === 0xe1 && len >= 8) {
            const seg = u.subarray(i + 4, i + 2 + len);
            if (
              seg.length >= 6 &&
              seg[0] === 0x45 && seg[1] === 0x78 &&
              seg[2] === 0x69 && seg[3] === 0x66 &&
              seg[4] === 0x00 && seg[5] === 0x00
            ) {
              resolve(u.slice(i, i + 2 + len));
              return;
            }
          }
          i += 2 + len;
        }
        resolve(null);
      };
      r.onerror = () => resolve(null);
      r.readAsArrayBuffer(file);
    });
  }

  function mergeJpegExif(jpegBuf, exifBytes) {
    const jpeg = new Uint8Array(jpegBuf);
    if (jpeg.length < 4 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return jpegBuf;
    let i = 2;
    while (i + 3 < jpeg.length) {
      if (jpeg[i] !== 0xff) { break; }
      const m = jpeg[i + 1];
      if (m === 0xda || m === 0xc0 || m === 0xc2 || m === 0xc4) break;
      const len = (jpeg[i + 2] << 8) | jpeg[i + 3];
      i += 2 + len;
    }
    const out = new Uint8Array(jpeg.length + exifBytes.length);
    out.set(jpeg.subarray(0, i), 0);
    out.set(exifBytes, i);
    out.set(jpeg.subarray(i), i + exifBytes.length);
    return out.buffer;
  }

  function makeJpegWithExif(img, item, w, h) {
    const c = drawToCanvas(img, w, h, true);
    return new Promise((resolve, reject) => {
      c.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("toBlob failed")); return; }
          readExifSegment(item.file).then((exif) => {
            if (!exif) { resolve(blob); return; }
            blob.arrayBuffer().then(
              (dst) => resolve(new Blob([mergeJpegExif(dst, exif)], { type: "image/jpeg" })),
              () => resolve(blob)
            );
          }, () => resolve(blob));
        },
        "image/jpeg",
        state.quality / 100
      );
    });
  }

  /* ------------------------------------------------------------------
     Convert one file
  ------------------------------------------------------------------ */
  function convertOne(item) {
    return decodeImage(item).then((img) => {
      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;
      const size = computeSize(srcW, srcH);
      const fmt = state.target;
      const needFill = el.fillBg.checked || NO_TRANSPARENCY.indexOf(fmt) !== -1;
      const w = Math.max(1, size.w);
      const h = Math.max(1, size.h);

      // ICO: square PNG-wrapped icon (max 256)
      if (fmt === "ico") {
        const s = Math.min(256, Math.max(16, Math.min(w, h)));
        const c = drawToCanvas(img, s, s, true);
        return new Promise((resolve, reject) => {
          c.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("ico failed"))),
            "image/png"
          );
        });
      }

      if (fmt === "jpeg" && state.exif === "keep") {
        return makeJpegWithExif(img, item, w, h);
      }

      const c = drawToCanvas(img, w, h, needFill);
      return new Promise((resolve, reject) => {
        c.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
          mimeFor(fmt),
          LOSSLESS.indexOf(fmt) !== -1 ? undefined : state.quality / 100
        );
      });
    });
  }

  /* ------------------------------------------------------------------
     Options UI
  ------------------------------------------------------------------ */
  function setTarget(fmt) {
    state.target = fmt;
    $$("#formatGroup .seg__btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-fmt") === fmt);
    });

    if (LOSSLESS.indexOf(fmt) !== -1) {
      el.qualityField.classList.add("hidden");
      el.formatNote.textContent = t("msg.format.note.lossless");
    } else {
      el.qualityField.classList.remove("hidden");
      el.formatNote.textContent = t("msg.format.note.quality");
    }
    if (NO_TRANSPARENCY.indexOf(fmt) !== -1) {
      el.formatNote.textContent = t("msg.format.note.transparent");
    }
  }

  function setResize(mode) {
    state.resize = mode;
    $$("[data-resize]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-resize") === mode);
    });
    el.ratioBox.classList.toggle("hidden", mode !== "ratio");
    el.customBox.classList.toggle("hidden", mode !== "custom");
  }

  function setExif(mode) {
    state.exif = mode;
    $$("[data-exif]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-exif") === mode);
    });
  }

  /* ------------------------------------------------------------------
     File list rendering
  ------------------------------------------------------------------ */
  function renderList() {
    const n = state.files.length;
    el.fileListWrap.classList.toggle("hidden", n === 0);
    el.fileCount.textContent = n;
    el.convertBtn.disabled = n === 0 || state.converting;
    el.convertCount.textContent = n ? "(" + n + ")" : "";

    el.fileList.innerHTML = "";
    state.files.forEach((item) => {
      el.fileList.appendChild(buildRow(item));
    });

    const done = state.files.filter((f) => f.outBlob);
    el.batchBar.classList.toggle("hidden", done.length === 0);
    if (done.length) {
      el.zipCount.textContent = "(" + done.length + ")";
      const before = done.reduce((a, f) => a + f.originalSize, 0);
      const after = done.reduce((a, f) => a + (f.outSize || 0), 0);
      const diff = after - before;
      const pct = before ? Math.round((diff / before) * 100) : 0;
      const cls = diff <= 0 ? "size-down" : "size-up";
      const sign = diff <= 0 ? "▼" : "▲";
      el.totalStat.innerHTML =
        fmtBytes(before) + " → <span class='" + cls + "'>" + fmtBytes(after) + " (" + sign + " " + Math.abs(pct) + "%)</span>";
    }
  }

  function buildRow(item) {
    const row = document.createElement("div");
    row.className = "file";
    row.setAttribute("data-id", item.id);

    // thumb
    const thumb = document.createElement("div");
    thumb.className = "file__thumb";
    if (item.thumbUrl) {
      const im = document.createElement("img");
      im.className = "file__thumb";
      im.src = item.thumbUrl;
      im.alt = item.name;
      row.appendChild(im);
    } else {
      thumb.classList.add("file__thumb--placeholder");
      thumb.textContent = "🖼️";
      row.appendChild(thumb);
    }

    // info
    const info = document.createElement("div");
    info.className = "file__info";
    const name = document.createElement("div");
    name.className = "file__name";
    name.textContent = item.outName || item.name;
    const meta = document.createElement("div");
    meta.className = "file__meta";
    if (item.status === "done" && item.outSize !== undefined) {
      const cls = item.outSize <= item.originalSize ? "size-down" : "size-up";
      meta.innerHTML =
        fmtBytes(item.originalSize) + " → <span class='" + cls + "'>" + fmtBytes(item.outSize) + "</span>";
    } else if (item.status === "error") {
      meta.innerHTML = "<span class='size-up'>⚠ " + (item.error || "error") + "</span>";
    } else {
      meta.textContent = fmtBytes(item.originalSize) + " · " + (item.kind ? item.kind.toUpperCase() : "?");
    }
    const bar = document.createElement("div");
    bar.className = "file__bar";
    const pct = item.status === "done" || item.status === "error" ? 100 : 0;
    bar.innerHTML = "<i style='width:" + pct + "%'></i>";
    if (item.status === "error") bar.querySelector("i").style.background = "var(--c-err)";
    info.appendChild(name);
    info.appendChild(meta);
    info.appendChild(bar);

    // right side
    const right = document.createElement("div");
    right.className = "file__right";
    const sizeEl = document.createElement("div");
    sizeEl.className = "file__size";
    if (item.status === "done") {
      sizeEl.innerHTML = "<small>✓ done</small>" + fmtBytes(item.outSize);
    } else {
      sizeEl.textContent = fmtBytes(item.originalSize);
    }
    const dl = document.createElement("button");
    dl.className = "icon-btn";
    dl.title = "Download";
    dl.textContent = "⬇️";
    dl.disabled = !item.outBlob;
    dl.onclick = () => {
      if (item.outBlob) download(item.outBlob, item.outName);
    };
    const del = document.createElement("button");
    del.className = "icon-btn";
    del.title = "Remove";
    del.textContent = "🗑️";
    del.onclick = () => removeFile(item.id);
    right.appendChild(sizeEl);
    right.appendChild(dl);
    right.appendChild(del);

    row.appendChild(info);
    row.appendChild(right);
    return row;
  }

  function removeFile(id) {
    const idx = state.files.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const it = state.files[idx];
    if (it.thumbUrl) URL.revokeObjectURL(it.thumbUrl);
    state.files.splice(idx, 1);
    renderList();
  }

  /* ------------------------------------------------------------------
     Adding files
  ------------------------------------------------------------------ */
  function addFiles(fileList) {
    const arr = Array.from(fileList || []);
    if (!arr.length) return;
    const images = arr.filter((f) => detectKind(f) !== null);
    if (!images.length) {
      toast(t("msg.drop.only.images"), "error");
      return;
    }
    const room = MAX_FILES - state.files.length;
    if (room <= 0) {
      toast(t("msg.limit"), "error");
      return;
    }
    const adding = images.slice(0, room);
    adding.forEach((file) => {
      state.files.push({
        id: state.nextId++,
        file: file,
        name: file.name,
        kind: detectKind(file),
        originalSize: file.size,
        status: "pending",
        outName: baseName(file.name) + "." + outExt(state.target)
      });
    });
    renderList();
    const left = images.length - adding.length;
    toast(t("msg.added", { n: adding.length }) + (left ? " (" + t("msg.limit") + ")" : ""), "ok");
  }

  /* ------------------------------------------------------------------
     Run conversion
  ------------------------------------------------------------------ */
  function runConvert() {
    if (!state.files.length) { toast(t("msg.no.file"), "error"); return; }
    state.converting = true;
    el.overlay.classList.remove("hidden");
    el.overlayText.textContent = t("overlay.convert");
    renderList();

    const tasks = state.files.filter((f) => f.status !== "done");

    const next = (i) => {
      if (i >= tasks.length) {
        state.converting = false;
        el.overlay.classList.add("hidden");
        const ok = state.files.filter((f) => f.status === "done").length;
        renderList();
        toast(t("msg.done", { n: ok }), "ok");
        return;
      }
      const item = tasks[i];
      el.overlayText.textContent = t("overlay.convert") + " " + (i + 1) + "/" + tasks.length;

      convertOne(item)
        .then((blob) => {
          if (!blob) throw new Error("empty");
          item.outBlob = blob;
          item.outSize = blob.size;
          item.outName = baseName(item.name) + "." + outExt(state.target);
          item.status = "done";
        })
        .catch((err) => {
          item.status = "error";
          item.error = String((err && err.message) || err);
        })
        .then(() => {
          renderList();
          setTimeout(() => next(i + 1), 30);
        });
    };
    next(0);
  }

  /* ------------------------------------------------------------------
     Minimal ZIP writer (store mode, no dependencies)
  ------------------------------------------------------------------ */
  function crc32(bytes) {
    let c = ~0;
    for (let i = 0; i < bytes.length; i++) {
      c ^= bytes[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
  }

  function makeZip(entries) {
    const chunks = [];
    const central = [];
    let offset = 0;

    function push(buf) {
      const u = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
      chunks.push(u);
      offset += u.length;
      return u;
    }

    function u16(v) { return new Uint8Array([v & 0xff, (v >>> 8) & 0xff]); }
    function u32(v) { return new Uint8Array([v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]); }
    function strToBytes(s) {
      return new TextEncoder().encode(s);
    }

    entries.forEach((e) => {
      const nameBytes = strToBytes(e.name);
      const crc = crc32(e.data);
      const localHeader = new Uint8Array(30);
      localHeader.set(u32(0x04034b50), 0);
      localHeader.set(u16(20), 4);            // version needed
      localHeader.set(u16(0x0800), 6);        // flags: UTF-8 name
      localHeader.set(u16(0), 8);             // method: store
      localHeader.set(u16(0), 10);            // time
      localHeader.set(u16(0x21), 12);         // date
      localHeader.set(u32(crc), 14);
      localHeader.set(u32(e.data.length), 18);
      localHeader.set(u32(e.data.length), 22);
      localHeader.set(u16(nameBytes.length), 26);
      localHeader.set(u16(0), 28);

      const dataOffset = offset;
      push(localHeader);
      push(nameBytes);
      push(e.data);

      const ch = new Uint8Array(46);
      ch.set(u32(0x02014b50), 0);
      ch.set(u16(20), 4);
      ch.set(u16(20), 6);
      ch.set(u16(0x0800), 8);
      ch.set(u16(0), 10);
      ch.set(u16(0), 12);
      ch.set(u16(0x21), 14);
      ch.set(u32(crc), 16);
      ch.set(u32(e.data.length), 20);
      ch.set(u32(e.data.length), 24);
      ch.set(u16(nameBytes.length), 28);
      ch.set(u16(0), 30);
      ch.set(u16(0), 32);
      ch.set(u16(0), 34);
      ch.set(u16(0), 36);
      ch.set(u32(0), 38);
      ch.set(u32(dataOffset), 42);
      central.push({ header: ch, name: nameBytes });
    });

    const centralOffset = offset;
    central.forEach((c) => {
      push(c.header);
      push(c.name);
    });

    const end = new Uint8Array(22);
    end.set(u32(0x06054b50), 0);
    end.set(u16(0), 4);
    end.set(u16(0), 6);
    end.set(u16(entries.length), 8);
    end.set(u16(entries.length), 10);
    end.set(u32(offset - centralOffset), 12);
    end.set(u32(centralOffset), 16);
    push(end);

    return new Blob(chunks, { type: "application/zip" });
  }

  function downloadZip() {
    const done = state.files.filter((f) => f.status === "done" && f.outBlob);
    if (!done.length) { toast(t("msg.empty.result"), "error"); return; }
    const entries = [];
    let pending = done.length;
    done.forEach((f) => {
      f.outBlob.arrayBuffer().then((buf) => {
        entries.push({ name: f.outName, data: new Uint8Array(buf) });
        if (--pending === 0) {
          try {
            const zip = makeZip(entries);
            download(zip, "converted-images.zip");
            toast(t("msg.zip.done"), "ok");
          } catch (e) {
            toast(t("msg.zip.fail"), "error");
          }
        }
      });
    });
  }

  function downloadEach() {
    const done = state.files.filter((f) => f.status === "done" && f.outBlob);
    if (!done.length) { toast(t("msg.empty.result"), "error"); return; }
    toast(t("msg.downloading", { n: done.length }), "ok");
    done.forEach((f, i) => {
      setTimeout(() => download(f.outBlob, f.outName), i * 250);
    });
  }

  /* ------------------------------------------------------------------
     Events
  ------------------------------------------------------------------ */
  function bindEvents() {
    // Dropzone
    el.dropzone.addEventListener("click", () => el.fileInput.click());
    el.dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.fileInput.click();
      }
    });
    ["dragenter", "dragover"].forEach((ev) => {
      el.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dropzone.classList.add("dragging");
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      el.dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dropzone.classList.remove("dragging");
      });
    });
    el.dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files) addFiles(dt.files);
    });
    el.fileInput.addEventListener("change", (e) => {
      addFiles(e.target.files);
      e.target.value = "";
    });

    // Drop anywhere on the page
    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => {
      e.preventDefault();
      if (e.target.closest && e.target.closest("#dropzone")) return;
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });

    // Segmented controls
    el.formatGroup.addEventListener("click", (e) => {
      const b = e.target.closest(".seg__btn");
      if (b) setTarget(b.getAttribute("data-fmt"));
    });
    $$("[data-resize]").forEach((b) =>
      b.addEventListener("click", () => setResize(b.getAttribute("data-resize")))
    );
    $$("[data-exif]").forEach((b) =>
      b.addEventListener("click", () => setExif(b.getAttribute("data-exif")))
    );

    // Quality
    el.quality.addEventListener("input", () => {
      state.quality = parseInt(el.quality.value, 10);
      el.qualityValue.textContent = state.quality + "%";
    });

    // Auto-update output names when target format changes
    el.formatGroup.addEventListener("click", (e) => {
      const b = e.target.closest(".seg__btn");
      if (!b) return;
      state.files.forEach((f) => {
        if (f.status !== "done") {
          f.outName = baseName(f.name) + "." + outExt(state.target);
        }
      });
      renderList();
    });

    // Convert / clear / downloads
    el.convertBtn.addEventListener("click", runConvert);
    el.clearBtn.addEventListener("click", () => {
      state.files.forEach((f) => {
        if (f.thumbUrl) URL.revokeObjectURL(f.thumbUrl);
      });
      state.files = [];
      renderList();
      toast(t("msg.cleared"), "ok");
    });
    el.downloadAll.addEventListener("click", downloadZip);
    el.downloadEach.addEventListener("click", downloadEach);

    // Language
    el.langToggle.addEventListener("click", () => window.I18n.toggle());
  }

  /* ------------------------------------------------------------------
     Public API
  ------------------------------------------------------------------ */
  window.app = {
    onLangChange() {
      setTarget(state.target);
      setResize(state.resize);
      renderList();
    }
  };

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  function init() {
    if (window.I18n && window.I18n.init) window.I18n.init();
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
    setTarget(state.target);
    setResize(state.resize);
    setExif(state.exif);
    state.quality = parseInt(el.quality.value, 10);
    bindEvents();
    renderList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
