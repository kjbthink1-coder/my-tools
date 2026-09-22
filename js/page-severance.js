/* ============================================================
   page-severance.js - 퇴직금 + 연봉 실수령액 페이지 부트스트랩
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
  ["#rtypeGroup", "#rtaxGroup", "#workerGroup", "#modeGroup", "#ftypeGroup"].forEach((s) => bindSeg($(s)));

  // 퇴직금: 근무 형태에 따라 필드 토글
  function syncRtype() {
    const t = document.querySelector('[data-rtype].active');
    const isMid = !!(t && t.getAttribute("data-rtype") === "mid");
    const af = $("#alreadyField");
    if (af) af.classList.toggle("hidden", !isMid);
  }
  const rtypeGroup = $("#rtypeGroup");
  if (rtypeGroup) rtypeGroup.addEventListener("click", () => setTimeout(syncRtype, 0));

  // 실수령액: 근로 형태/입력 방식에 따라 필드 토글
  function syncSalaryFields() {
    const w = document.querySelector('[data-worker].active');
    const m = document.querySelector('[data-mode].active');
    const isFree = !!(w && w.getAttribute("data-worker") === "freelancer");
    const isAnnual = !!(m && m.getAttribute("data-mode") === "annual");

    const dep = $("#dependentsField");
    const non = $("#nonTaxField");
    if (dep) dep.classList.toggle("hidden", isFree);
    if (non) non.classList.toggle("hidden", isFree);
    const label = $("#salaryInputLabel");
    if (label) {
      label.textContent = isAnnual ? (isFree ? "총수입금액" : "연봉") : isFree ? "월 수입" : "월급";
    }
    const fGroup = $("#ftypeField");
    if (fGroup) fGroup.classList.toggle("hidden", !isFree);
  }
  ["#workerGroup", "#modeGroup"].forEach((s) => {
    const g = $(s);
    if (g) g.addEventListener("click", () => setTimeout(syncSalaryFields, 0));
  });

  // 빠른 금액
  $$("#salaryQuick button").forEach((b) => {
    b.addEventListener("click", () => { $("#salaryInput").value = commaize(b.getAttribute("data-sal")); });
  });

  // 숫자 입력
  ["#retireSalary", "#retireYears", "#alreadyReceived", "#salaryInput", "#dependents", "#nonTaxIncome"]
    .forEach((sel) => bindNumberInput($(sel)));
  bindDecimal($("#retireYears"));

  // 계산 버튼
  const rBtn = $("#retireCalcBtn");
  if (rBtn) rBtn.addEventListener("click", () => window.RetireCalc.calculate());
  const sBtn = $("#salaryCalcBtn");
  if (sBtn) sBtn.addEventListener("click", () => window.SalaryCalc.calculate());

  // Enter 키
  $$("#severance input, #salary input").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const grid = input.closest(".calc__grid");
        const btn = grid ? grid.querySelector("[id$=CalcBtn]") : null;
        if (btn) btn.click();
      }
    });
  });

  // 초기화
  syncRtype();
  syncSalaryFields();
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  window.RetireCalc.calculate(true);
  window.SalaryCalc.calculate(true);
})();
