/* ============================================================
   i18n.js - Korean / English translations
   ============================================================ */
const I18N = {
  ko: {
    "brand": "이미지변환기",
    "nav.convert": "변환하기",
    "nav.features": "기능",
    "nav.faq": "FAQ",
    "nav.cta": "시작하기",
    "hero.badge": "🔒 100% 브라우저 처리 · 서버 저장 없음",
    "hero.title1": "이미지 변환은",
    "hero.title2": "클릭 한 번이면 끝!",
    "hero.desc": "PNG, JPG, WEBP, AVIF, GIF, BMP, ICO까지. 여러 장을 한 번에 변환하고, 품질·크기·배경까지 내 마음대로. 파일은 내 컴퓨터에서만 처리됩니다.",
    "hero.cta1": "무료로 변환하기",
    "hero.cta2": "기능 둘러보기",
    "hero.supports": "지원 포맷",
    "convert.title": "이미지 변환하기",
    "convert.desc": "아래 영역에 파일을 끌어다 놓거나 클릭해서 선택하세요.",
    "drop.title": "여기로 끌어다 놓으세요",
    "drop.sub": "또는 클릭해서 파일 선택 · 여러 장 가능",
    "drop.hint": "지원: PNG · JPG · WEBP · AVIF · GIF · BMP · ICO · HEIC · TIFF",
    "opt.title": "변환 설정",
    "opt.format": "변환할 포맷",
    "opt.quality": "품질 (압축률)",
    "opt.quality.low": "압축↑",
    "opt.quality.high": "고품질",
    "opt.resize": "이미지 크기",
    "opt.resize.none": "원본 유지",
    "opt.resize.ratio": "비율로",
    "opt.resize.custom": "직접 지정",
    "opt.resize.scale": "배율",
    "opt.resize.w": "가로",
    "opt.resize.h": "세로",
    "opt.resize.keep": "비율 유지",
    "opt.bg": "배경 (투명 → 채우기)",
    "opt.bg.fill": "배경색으로 채우기",
    "opt.bg.note": "PNG·WEBP·GIF는 투명을 유지할 수 있어요. JPG·BMP·ICO는 투명을 지원하지 않아 배경색이 필요합니다.",
    "opt.exif": "메타데이터 (EXIF)",
    "opt.exif.remove": "제거 (용량↓)",
    "opt.exif.keep": "유지 (JPG)",
    "opt.convert": "변환 시작",
    "opt.privacy": "🔒 모든 변환은 브라우저 내부에서 처리되며, 어느 서버에도 전송·저장되지 않습니다.",
    "list.title": "파일 목록",
    "list.clear": "전체 삭제",
    "list.total": "전체 용량 변화",
    "list.zip": "전체 ZIP 다운로드",
    "list.each": "각각 다운로드",
    "ad.text": "",
    "feat.title": "왜 이 이미지변환기인가요?",
    "feat.desc": "설치도, 가입도, 서버 업로드도 필요 없어요.",
    "feat.f1.t": "압도적으로 빠르고 가벼움",
    "feat.f1.d": "내 PC의 브라우저가 직접 변환합니다. 업로드 대기 시간이 0초, 여러 장도 찰나에.",
    "feat.f2.t": "개인정보 100% 보호",
    "feat.f2.d": "사진이 서버로 한 장도 올라가지 않습니다. 캡처, 유출, 추적 걱정 끝.",
    "feat.f3.t": "다양한 포맷 지원",
    "feat.f3.d": "PNG · JPG · WEBP · AVIF · GIF · BMP · ICO 출력은 물론 HEIC·TIFF 입력까지.",
    "feat.f4.t": "세부 설정 자유로움",
    "feat.f4.d": "품질, 리사이즈, 배경 채우기, EXIF 유지/제거까지 디테일하게.",
    "feat.f5.t": "일괄 변환 & ZIP",
    "feat.f5.d": "수십 장도 드래그 한 번에. 결과는 ZIP으로 한 번에 받으세요.",
    "feat.f6.t": "완전 무료 · 횟수 제한 없음",
    "feat.f6.d": "회원가입도 결제도 필요 없어요. 몇 번이든 무제한으로 사용하세요.",
    "faq.title": "자주 묻는 질문",
    "faq.q1": "파일이 서버에 저장되나요?",
    "faq.a1": "아니요. 모든 변환은 브라우저 안에서만 처리되고, 어떤 파일도 인터넷으로 전송되지 않습니다. 페이지를 닫으면 모두 사라져요.",
    "faq.q2": "HEIC(iPhone 사진)도 변환되나요?",
    "faq.a2": "네. HEIC/HEIF 파일을 JPG·PNG·WEBP 등으로 변환할 수 있습니다. 최신 브라우저(Chrome·Edge·Safari)를 권장해요.",
    "faq.q3": "한 번에 몇 장까지 변환할 수 있나요?",
    "faq.a3": "장당 제한은 없습니다. 단, 매우 많은 파일은 PC 성능에 따라 시간이 조금 걸릴 수 있어요.",
    "faq.q4": "AVIF는 모든 브라우저에서 되나요?",
    "faq.a4": "AVIF 저장은 Chrome 85+, Edge, Opera 등에서 지원합니다. Safari/Firefox에서는 다른 포맷을 선택해 주세요.",
    "faq.q5": "변환 후 화질이 떨어져요.",
    "faq.a5": "품질 슬라이더를 90~100%로 올려 보세요. PNG는 무손실이라 화질 손실이 아예 없습니다.",
    "footer.note": "100% 클라이언트 사이드 · 서버 저장 제로 · 무료",
    "overlay.convert": "변환 중입니다...",
    // dynamic messages
    "msg.format.note.transparent": "JPG·BMP·ICO는 투명을 지원하지 않아 배경색으로 채워집니다.",
    "msg.format.note.lossless": "무손실 포맷입니다. 품질 설정은 적용되지 않아요.",
    "msg.format.note.quality": "품질 슬라이더로 압축률을 조절하세요.",
    "msg.no.file": "파일을 먼저 선택해 주세요.",
    "msg.converting": "변환 중...",
    "msg.done": "변환 완료! 총 {n}장",
    "msg.fail": "{name} 변환 실패",
    "msg.empty.result": "변환 결과가 없습니다.",
    "msg.cleared": "목록을 비웠습니다.",
    "msg.zip.done": "ZIP 다운로드 완료!",
    "msg.zip.fail": "ZIP 생성 실패",
    "msg.downloading": "{n}장을 각각 다운로드합니다...",
    "msg.drop.only.images": "이미지 파일만 넣을 수 있어요.",
    "msg.added": "{n}장 추가됨",
    "msg.limit": "파일이 너무 많아요. 50장 이하로 넣어주세요."
  },
  en: {
    "brand": "Image Converter",
    "nav.convert": "Convert",
    "nav.features": "Features",
    "nav.faq": "FAQ",
    "nav.cta": "Get Started",
    "hero.badge": "🔒 100% in-browser · never uploaded",
    "hero.title1": "Convert images in",
    "hero.title2": "just one click!",
    "hero.desc": "PNG, JPG, WEBP, AVIF, GIF, BMP and ICO. Batch convert many files at once with full control over quality, size and background. Everything is processed locally on your device.",
    "hero.cta1": "Convert for free",
    "hero.cta2": "See features",
    "hero.supports": "Supported formats",
    "convert.title": "Convert your images",
    "convert.desc": "Drop files into the box below, or click to browse. Multiple files are supported.",
    "drop.title": "Drop your files here",
    "drop.sub": "or click to browse · multiple files allowed",
    "drop.hint": "Supports: PNG · JPG · WEBP · AVIF · GIF · BMP · ICO · HEIC · TIFF",
    "opt.title": "Conversion settings",
    "opt.format": "Target format",
    "opt.quality": "Quality (compression)",
    "opt.quality.low": "Smaller",
    "opt.quality.high": "Higher quality",
    "opt.resize": "Image size",
    "opt.resize.none": "Keep original",
    "opt.resize.ratio": "By scale",
    "opt.resize.custom": "Custom",
    "opt.resize.scale": "Scale",
    "opt.resize.w": "Width",
    "opt.resize.h": "Height",
    "opt.resize.keep": "Keep aspect ratio",
    "opt.bg": "Background (transparent → fill)",
    "opt.bg.fill": "Fill with background color",
    "opt.bg.note": "PNG · WEBP · GIF keep transparency. JPG · BMP · ICO don't support transparency, so a background color is used.",
    "opt.exif": "Metadata (EXIF)",
    "opt.exif.remove": "Remove (smaller)",
    "opt.exif.keep": "Keep (JPG)",
    "opt.convert": "Convert",
    "opt.privacy": "🔒 All conversions run inside your browser. Nothing is ever sent to or stored on a server.",
    "list.title": "Files",
    "list.clear": "Clear all",
    "list.total": "Total size change",
    "list.zip": "Download all as ZIP",
    "list.each": "Download each",
    "ad.text": "Ad space (AdSense integration coming)",
    "feat.title": "Why this image converter?",
    "feat.desc": "No installation, no sign-up, no uploads.",
    "feat.f1.t": "Fast & lightweight",
    "feat.f1.d": "Your browser does the work locally. Zero upload time — even dozens of files in a flash.",
    "feat.f2.t": "100% private",
    "feat.f2.d": "Not a single photo leaves your device. No servers, no leaks, no tracking.",
    "feat.f3.t": "Many formats",
    "feat.f3.d": "Export to PNG · JPG · WEBP · AVIF · GIF · BMP · ICO. HEIC and TIFF input supported too.",
    "feat.f4.t": "Fine-grained settings",
    "feat.f4.d": "Quality, resize, background fill, and EXIF keep/remove — exactly the way you want.",
    "feat.f5.t": "Batch & ZIP",
    "feat.f5.d": "Drag in dozens of files at once and grab the results as a single ZIP archive.",
    "feat.f6.t": "Free & unlimited",
    "feat.f6.d": "No account, no payment. Use it as many times as you like.",
    "faq.title": "Frequently asked questions",
    "faq.q1": "Are my files stored on a server?",
    "faq.a1": "No. Every conversion happens inside your browser and no file is ever transmitted over the internet. Close the tab and everything is gone.",
    "faq.q2": "Does it convert HEIC (iPhone photos)?",
    "faq.a2": "Yes. HEIC/HEIF files can be converted to JPG, PNG, WEBP and more. We recommend a modern browser such as Chrome, Edge or Safari.",
    "faq.q3": "How many files can I convert at once?",
    "faq.a3": "There is no per-file limit. Very large batches may take a little longer depending on your computer.",
    "faq.q4": "Does AVIF work in every browser?",
    "faq.a4": "AVIF export is supported in Chrome 85+, Edge and Opera. On Safari or Firefox, please choose another format.",
    "faq.q5": "The quality seems lower after conversion.",
    "faq.a5": "Try raising the quality slider to 90–100%. PNG is lossless, so there is no quality loss at all.",
    "footer.note": "100% client-side · zero server storage · free",
    "overlay.convert": "Converting...",
    "msg.format.note.transparent": "JPG · BMP · ICO don't support transparency, so the background color is applied.",
    "msg.format.note.lossless": "Lossless format. The quality setting doesn't apply.",
    "msg.format.note.quality": "Use the quality slider to adjust compression.",
    "msg.no.file": "Please select files first.",
    "msg.converting": "Converting...",
    "msg.done": "Done! {n} files converted",
    "msg.fail": "Failed to convert {name}",
    "msg.empty.result": "No conversion results.",
    "msg.cleared": "List cleared.",
    "msg.zip.done": "ZIP downloaded!",
    "msg.zip.fail": "Failed to create ZIP",
    "msg.downloading": "Downloading {n} files individually...",
    "msg.drop.only.images": "Only image files are allowed.",
    "msg.added": "{n} added",
    "msg.limit": "Too many files. Please add 50 or fewer."
  }
};

const I18n = {
  lang: "ko",

  init() {
    const saved = localStorage.getItem("ic_lang");
    if (saved && I18N[saved]) this.lang = saved;
    else {
      const nav = (navigator.language || "ko").toLowerCase();
      this.lang = nav.startsWith("ko") ? "ko" : "en";
    }
    this.apply();
    const label = document.getElementById("langLabel");
    if (label) label.textContent = this.lang === "ko" ? "EN" : "KO";
    document.documentElement.lang = this.lang;
  },

  toggle() {
    this.lang = this.lang === "ko" ? "en" : "ko";
    localStorage.setItem("ic_lang", this.lang);
    this.apply();
    const label = document.getElementById("langLabel");
    if (label) label.textContent = this.lang === "ko" ? "EN" : "KO";
    document.documentElement.lang = this.lang;
    // re-render dynamic UI labels
    if (window.app && typeof window.app.onLangChange === "function") {
      window.app.onLangChange();
    }
  },

  t(key, vars) {
    let s = (I18N[this.lang] && I18N[this.lang][key]) || (I18N.ko && I18N.ko[key]) || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return s;
  },

  apply() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = this.t(el.getAttribute("data-i18n"));
    });
  }
};

window.I18n = I18n;
