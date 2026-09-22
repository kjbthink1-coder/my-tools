/* ============================================================
   i18n.js - Korean / English translations
   Default: English (Global First), switchable to Korean
   ============================================================ */
const I18N = {
  ko: {
    "brand": "이미지변환기",
    "nav.convert": "변환하기",
    "nav.idphoto": "🪪 증명사진",
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
    "drop.aria": "파일 선택",
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
    "opt.bg.title": "배경색",
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
    "crop.title": "🪪 증명사진 · 여권사진 규격 맞추기",
    "crop.desc": "사진을 올리고 규격을 고르면, 점선 가이드에 맞춰 영역을 드래그해서 자를 수 있어요. 용량까지 알아서 줄여드려요.",
    "crop.step1": "1. 사진 업로드",
    "crop.drop.aria": "크롭할 파일 선택",
    "crop.drop.title": "증명사진으로 만들 사진을 올려주세요",
    "crop.drop.sub": "또는 클릭해서 파일 선택",
    "crop.step2": "2. 용도 선택 (규격 프리셋)",
    "crop.preset.passport": "여권 사진",
    "crop.preset.resume": "이력서 사진",
    "crop.preset.visa": "미국 비자",
    "crop.preset.idcard": "신분증",
    "crop.preset.profile": "프로필(정방)",
    "crop.preset.custom": "직접 지정",
    "crop.preset.custom.sub": "픽셀 입력",
    "crop.custom.w": "가로 px",
    "crop.custom.h": "세로 px",
    "crop.step3": "3. 영역 선택",
    "crop.stage.empty": "사진을 올리면 이곳에 미리보기가 나와요.<br />점선 박스를 드래그해서 얼굴 영역을 맞춰주세요.",
    "crop.step4": "4. 출력 품질 · 목적",
    "crop.step5": "5. 저장 포맷",
    "crop.download": "✂️ 자르고 다운로드",
    "crop.privacy": "🔒 사진은 서버에 전송되지 않고 브라우저에서만 잘려요.",
    "crop.msg.only.image": "⚠️ 이미지 파일만 올 수 있어요.",
    "crop.msg.load.fail": "⚠️ 이 사진은 열 수 없어요. 다른 파일을 올려주세요.",
    "crop.msg.cropping": "✂️ 자르는 중...",
    "crop.msg.done": "✅ 완료! {w}×{h}px · {size}로 저장했어요.",
    "crop.msg.crop.fail": "⚠️ 자르기에 실패했어요. 다시 시도해 주세요.",
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
    "guide.title": "📚 함께 읽으면 도움되는 이미지 포맷 전문 가이드",
    "guide.webp.title": "🖼️ WebP란? JPG·PNG 대신 써야 하는 이유",
    "guide.webp.desc": "웹사이트 속도를 높이는 압축 원리와 호환성, 실무 활용법 총정리",
    "guide.heic.title": "📱 HEIC·AVIF 호환성 완벽 해결 가이드",
    "guide.heic.desc": "아이폰 HEIC 사진이 윈도우에서 안 열릴 때 해결하는 3가지 방법",
    "guide.exif.title": "📍 사진 속 집 주소·GPS 위치 EXIF 메타데이터 삭제법",
    "guide.exif.desc": "스마트폰 사진 속 위도·경도 정보, 브라우저 1초 삭제로 개인정보 보호",
    "guide.comp.title": "⚡ 이미지 압축 품질 80%의 법칙 & 용량 절감 노하우",
    "guide.comp.desc": "화질 저하 없이 웹 로딩 속도를 극대화하는 WebP·JPG 최적 압축 스위트스팟",
    "footer.note": "100% 클라이언트 사이드 · 서버 저장 제로 · 무료",
    "footer.alltools": "🧰 계산기 모음",
    "footer.disclaimer": "본 사이트는 개인 개발자가 운영하는 무료 도구 사이트이며, 실제 금융 거래 및 법적 효력은 해당 기관의 기준을 따릅니다.",
    "footer.about": "소개 및 문의",
    "footer.terms": "이용약관",
    "footer.privacy": "개인정보처리방침",
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
    "nav.idphoto": "🪪 ID Photo",
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
    "drop.aria": "Select files",
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
    "opt.bg.title": "Background color",
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
    "ad.text": "Ad space",
    "crop.title": "🪪 ID & Passport Photo Resizer",
    "crop.desc": "Upload your photo, select a standard preset, and drag the guide box to crop. File size is automatically optimized.",
    "crop.step1": "1. Upload Photo",
    "crop.drop.aria": "Select photo to crop",
    "crop.drop.title": "Drop your photo here",
    "crop.drop.sub": "or click to browse from device",
    "crop.step2": "2. Select Purpose (Presets)",
    "crop.preset.passport": "Passport",
    "crop.preset.resume": "Resume",
    "crop.preset.visa": "US Visa",
    "crop.preset.idcard": "National ID",
    "crop.preset.profile": "Square Profile",
    "crop.preset.custom": "Custom",
    "crop.preset.custom.sub": "Enter px",
    "crop.custom.w": "Width px",
    "crop.custom.h": "Height px",
    "crop.step3": "3. Select Area",
    "crop.stage.empty": "Upload a photo to preview here.<br />Drag the dotted box to fit your face.",
    "crop.step4": "4. Output Quality & Purpose",
    "crop.step5": "5. Save Format",
    "crop.download": "✂️ Crop & Download",
    "crop.privacy": "🔒 Photos are processed locally in your browser only.",
    "crop.msg.only.image": "⚠️ Only image files are supported.",
    "crop.msg.load.fail": "⚠️ Failed to load this photo. Please try another.",
    "crop.msg.cropping": "✂️ Cropping...",
    "crop.msg.done": "✅ Done! Saved as {w}×{h}px · {size}.",
    "crop.msg.crop.fail": "⚠️ Failed to crop. Please try again.",
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
    "guide.title": "📚 Helpful Guides on Image Formats",
    "guide.webp.title": "🖼️ What is WebP? Why You Should Switch from JPG & PNG",
    "guide.webp.desc": "Compression mechanics, browser compatibility, and real-world loading speed tests",
    "guide.heic.title": "📱 How to Open & Convert HEIC & AVIF Photos",
    "guide.heic.desc": "3 simple ways to open iPhone HEIC images on Windows PCs without quality loss",
    "guide.exif.title": "📍 How to Strip GPS Location & EXIF Metadata from Photos",
    "guide.exif.desc": "Protect your home location and privacy by removing hidden GPS tags in 1 second",
    "guide.comp.title": "⚡ The 80% Image Quality Rule & Smart Compression Tips",
    "guide.comp.desc": "Find the sweet spot to slash image weight by 80% with zero visible quality degradation",
    "footer.note": "100% client-side · zero server storage · free",
    "footer.alltools": "🧰 All Tools",
    "footer.disclaimer": "This site is a free tool site operated by an individual developer. Actual financial transactions and legal effects follow the standards of the relevant institutions.",
    "footer.about": "About & Contact",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",
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
  lang: "en", // Default to English (Global First)

  init() {
    const saved = localStorage.getItem("ic_lang");
    if (saved && I18N[saved]) {
      this.lang = saved;
    } else {
      this.lang = "en"; // Default is English
    }
    this.apply();
    this.updateToggleBtn();
    document.documentElement.lang = this.lang;
  },

  updateToggleBtn() {
    const label = document.getElementById("langLabel");
    if (label) {
      // When current is English, button offers to switch to Korean ("KO")
      // When current is Korean, button offers to switch to English ("EN")
      label.textContent = this.lang === "en" ? "KO" : "EN";
    }
  },

  toggle() {
    this.lang = this.lang === "en" ? "ko" : "en";
    localStorage.setItem("ic_lang", this.lang);
    this.apply();
    this.updateToggleBtn();
    document.documentElement.lang = this.lang;
    // re-render dynamic UI labels in app.js
    if (window.app && typeof window.app.onLangChange === "function") {
      window.app.onLangChange();
    }
    // re-render dynamic UI labels in crop.js
    if (window.crop && typeof window.crop.onLangChange === "function") {
      window.crop.onLangChange();
    }
  },

  t(key, vars) {
    let s = (I18N[this.lang] && I18N[this.lang][key]) || (I18N.en && I18N.en[key]) || (I18N.ko && I18N.ko[key]) || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return s;
  },

  apply() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const val = this.t(el.getAttribute("data-i18n"));
      if (val.includes("<")) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", this.t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.setAttribute("title", this.t(el.getAttribute("data-i18n-title")));
    });
  }
};

window.I18n = I18n;

