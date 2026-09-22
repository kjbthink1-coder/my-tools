/* ============================================================
   page-loan.js - 대출 이자 계산기 페이지 부트스트랩
   (입력 포맷, 버튼 바인딩, 초기 계산만 담당)
   ============================================================ */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function toast(msg, kind) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.className = "toast show" + (kind ? " " + kind : "");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { t.className = "toast"; }, 2400);
  }
  window.App = { toast: toast };

  function commaize(str) {
    const parts = String(str).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function bindNumberInput(input) {
    if (!input) return;
    input.addEventListener("input", () => {
      input.value = commaize(input.value.replace(/[^0-9.]/g, ""));
    });
    input.addEventListener("blur", () => {
      const v = input.value.replace(/,/g, "");
      if (v && !isNaN(parseFloat(v))) input.value = commaize(v);
    });
  }

  function bindDecimal(input) {
    if (!input) return;
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9.]/g, "");
      const parts = input.value.split(".");
      if (parts.length > 2) input.value = parts[0] + "." + parts.slice(1).join("");
    });
    input.addEventListener("blur", () => {
      const v = parseFloat(input.value);
      if (!isNaN(v) && input.value.indexOf(".") === -1) input.value = v.toFixed(1);
    });
  }

  // 상환 방식 세그먼트
  const methodGroup = $("#methodGroup");
  if (methodGroup) {
    methodGroup.addEventListener("click", (e) => {
      const b = e.target.closest(".seg__btn");
      if (!b) return;
      Array.from(methodGroup.querySelectorAll(".seg__btn")).forEach((x) =>
        x.classList.toggle("active", x === b)
      );
    });
  }

  // 빠른 금액
  $$("#quickAmounts button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#loanAmount").value = commaize(b.getAttribute("data-amt"));
    });
  });

  // 숫자 입력
  ["#loanAmount", "#loanPeriod", "#gracePeriod"].forEach((sel) => bindNumberInput($(sel)));
  bindDecimal($("#loanRate"));
  bindDecimal($("#prepayFee"));

  // 계산 / CSV / 전체보기
  const calcBtn = $("#loanCalcBtn");
  if (calcBtn) calcBtn.addEventListener("click", () => window.LoanCalc.calculate());
  const csvBtn = $("#csvBtn");
  if (csvBtn) csvBtn.addEventListener("click", () => window.LoanCalc.exportCSV());
  const showAll = $("#showAllRows");
  if (showAll) showAll.addEventListener("change", () => window.LoanCalc.refresh());

  // 대출 종류별 수수료 안내
  const loanType = $("#loanType");
  const fee = $("#prepayFee");
  function syncNote() {
    if (!loanType || !fee) return;
    const hint = fee.parentElement.querySelector(".field__note");
    if (!hint) return;
    hint.textContent =
      loanType.value === "mortgage"
        ? "주택담보대출은 장기대출의 경우 중도상환수수료가 면제될 수 있어요. (1년 미만 단기대출은 예외)"
        : "신용대출은 중도상환수수료 면제 상품이 많아요. (대출 후 3년 경과 시 면제 포함)";
  }
  if (loanType) loanType.addEventListener("change", syncNote);
  syncNote();

  // Enter 키로 계산
  $$("#calculator input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); calcBtn && calcBtn.click(); }
    });
  });

  // 연도 + 초기 계산
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  window.LoanCalc.calculate(true);
})();
