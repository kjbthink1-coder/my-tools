/* ============================================================
   page-passport.js - 여권·증명사진 규격 변환기 페이지 부트스트랩
   (연도 표시만 담당; 모든 크롭 로직/입력 바인딩은 crop.js)
   ============================================================ */
(function () {
  "use strict";

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
