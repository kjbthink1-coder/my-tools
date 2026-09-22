/* ============================================================
   page-savings.js - 복리 적금 + 연차·수당 페이지 부트스트랩
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

  // 범용 세그먼트 (그룹 내 단일 선택)
  function bindSeg(group) {
    if (!group) return;
    group.addEventListener("click", (e) => {
      const b = e.target.closest(".seg__btn");
      if (!b) return;
      Array.from(group.querySelectorAll(".seg__btn")).forEach((x) =>
        x.classList.toggle("active", x === b)
      );
    });
  }
  ["#ctypeGroup", "#ptypeGroup", "#taxGroup", "#atypeGroup"].forEach((s) => bindSeg($(s)));

  // 납입 방식에 따라 필드 토글
  function syncPtype() {
    const p = document.querySelector('[data-ptype].active');
    const isMonthly = !!(p && p.getAttribute("data-ptype") === "monthly");
    const mf = $("#monthlyField");
    const lf = $("#lumpField");
    if (mf) mf.classList.toggle("hidden", !isMonthly);
    if (lf) lf.classList.toggle("hidden", isMonthly);
  }
  const ptypeGroup = $("#ptypeGroup");
  if (ptypeGroup) ptypeGroup.addEventListener("click", () => setTimeout(syncPtype, 0));

  // 계산 항목에 따라 필드 토글
  function syncAtype() {
    const t = document.querySelector('[data-atype].active');
    const isAnnual = !!(t && t.getAttribute("data-atype") === "annual");
    const af = $("#annualFields");
    const wf = $("#weeklyFields");
    if (af) af.classList.toggle("hidden", !isAnnual);
    if (wf) wf.classList.toggle("hidden", isAnnual);
  }
  const atypeGroup = $("#atypeGroup");
  if (atypeGroup) atypeGroup.addEventListener("click", () => setTimeout(syncAtype, 0));

  // 빠른 금액
  $$("#monthlyQuick button").forEach((b) => {
    b.addEventListener("click", () => { $("#monthlyAmount").value = commaize(b.getAttribute("data-mam")); });
  });
  $$("#lumpQuick button").forEach((b) => {
    b.addEventListener("click", () => { $("#lumpAmount").value = commaize(b.getAttribute("data-lam")); });
  });

  // 숫자 입력
  ["#monthlyAmount", "#lumpAmount", "#compoundPeriod", "#aSalary", "#aTotalDays", "#aUsedDays", "#wHourlyPay", "#wDays"]
    .forEach((sel) => bindNumberInput($(sel)));
  bindDecimal($("#compoundRate"));
  bindDecimal($("#wHours"));

  // 계산 버튼
  const cBtn = $("#compoundCalcBtn");
  if (cBtn) cBtn.addEventListener("click", () => window.CompoundCalc.calculate());
  const aBtn = $("#allowanceCalcBtn");
  if (aBtn) aBtn.addEventListener("click", () => window.AllowanceCalc.calculate());

  // Enter 키
  $$("#savings input, #allowance input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const grid = input.closest(".calc__grid");
        const btn = grid ? grid.querySelector("[id$=CalcBtn]") : null;
        if (!btn) {
          const sec = input.closest("section");
          const secBtn = sec ? sec.querySelector("[id$=CalcBtn]") : null;
          if (secBtn) secBtn.click();
          return;
        }
        btn.click();
      }
    });
  });

  // 초기화
  syncPtype();
  syncAtype();
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  window.CompoundCalc.calculate(true);
  window.AllowanceCalc.calculate(true);
})();
