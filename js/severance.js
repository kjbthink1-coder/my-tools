/* ============================================================
   retire.js - 퇴직금 계산기
   - 퇴직금 = (퇴직 직전 3개월 평균임금 × 재직일수) / 365 × 30
   - 중간정산 (이미 수령한 금액 차액)
   - 퇴직소득세 (일시금 과세) 근사치
   ============================================================ */
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n) || 0).toLocaleString("ko-KR");

  /* 퇴직소득세 근사치 (누진공제 방식, 2025년 기준 참고용)
     과세표준 = 퇴직금 - 비과세(300만원 × 근속연수) */
  const RETIRE_TAX_TABLE = [
    { upTo: 14000000, rate: 0.06, deduct: 0 },
    { upTo: 50000000, rate: 0.15, deduct: 1260000 },
    { upTo: 88000000, rate: 0.24, deduct: 5760000 },
    { upTo: 150000000, rate: 0.35, deduct: 15440000 },
    { upTo: 300000000, rate: 0.38, deduct: 19940000 },
    { upTo: 500000000, rate: 0.40, deduct: 25940000 },
    { upTo: 1000000000, rate: 0.42, deduct: 35940000 },
    { upTo: Infinity, rate: 0.45, deduct: 65940000 }
  ];

  function progressiveTax(base) {
    for (let i = 0; i < RETIRE_TAX_TABLE.length; i++) {
      if (base <= RETIRE_TAX_TABLE[i].upTo) {
        return base * RETIRE_TAX_TABLE[i].rate - RETIRE_TAX_TABLE[i].deduct;
      }
    }
    return 0;
  }

  /* ----------------------------------------------------------------
     입력
  ---------------------------------------------------------------- */
  function parseNum(str, def) {
    if (typeof str === "number") return str;
    const n = parseFloat(String(str || "").replace(/[^0-9.\-]/g, ""));
    return isNaN(n) ? (def === undefined ? 0 : def) : n;
  }

  function q(id) {
    return document.getElementById(id);
  }

  function active(sel) {
    return document.querySelector(sel + ".active");
  }

  function getInputs() {
    const t = active("[data-rtype]");
    const tx = active("[data-rtax]");
    return {
      rtype: t ? t.getAttribute("data-rtype") : "continue",
      rtax: tx ? tx.getAttribute("data-rtax") : "no",
      salary: parseNum((q("retireSalary") || {}).value),
      years: parseNum((q("retireYears") || {}).value),
      already: parseNum((q("alreadyReceived") || {}).value)
    };
  }

  /* ----------------------------------------------------------------
     계산
  ---------------------------------------------------------------- */
  function calcRetire(o) {
    // 근속일수 (1년 미만은 일할 계산)
    const days = Math.max(0, o.years * 365);
    const monthlySalary = Math.max(0, o.salary);

    // 입력값은 '월 평균임금'이므로 일 평균임금으로 변환
    // (퇴직직전 3개월 총임금 ÷ 89일 근사치 = 월급 × 12 ÷ 365)
    const dailySalary = (monthlySalary * 12) / 365;

    // 퇴직금 = 평균임금(일당) × 재직일수 ÷ 365 × 30
    let severance = (dailySalary * days) / 365 * 30;

    // 중간정산 시 이미 수령한 금액 차감
    const already = Math.max(0, o.already || 0);
    if (o.rtype === "mid") {
      severance = Math.max(0, severance - already);
    }

    // 퇴직소득세 (일시금): 비과세 = 300만원 × 근속연수
    const yearsForTax = Math.max(1, Math.floor(o.years) || 1);
    const nonTaxable = 3000000 * yearsForTax;
    let tax = 0;
    if (o.rtax === "yes") {
      const taxBase = Math.max(0, severance - nonTaxable);
      tax = Math.max(0, progressiveTax(taxBase));
    }

    const net = Math.max(0, severance - tax);

    return {
      severance: severance,
      tax: tax,
      net: net,
      nonTaxable: nonTaxable,
      yearsForTax: yearsForTax,
      days: days,
      dailySalary: dailySalary
    };
  }

  /* ----------------------------------------------------------------
     렌더링
  ---------------------------------------------------------------- */
  function render(o, r) {
    const host = q("retireResult");
    if (!host) return;
    const isMid = o.rtype === "mid";
    const title = isMid ? "중간정산" : "계속 근무";
    const taxLabel = o.rtax === "yes" ? "과세 (일시금)" : "면세 (퇴직연금)";

    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">' + title + " · " + taxLabel + "</span></h3>" +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">실수령 퇴직금</div>' +
          '<div class="rcard__value">' + fmt(r.net) + '원</div>' +
          '<div class="rcard__sub">세전 퇴직금 ' + fmt(r.severance) + "원</div></div>" +
        (r.tax
          ? '<div class="rcard rcard--green"><div class="rcard__label">퇴직소득세</div>' +
            '<div class="rcard__value">' + fmt(r.tax) + '원</div>' +
            '<div class="rcard__sub">비과세 ' + fmt(r.nonTaxable) + "원 (" + r.yearsForTax + "년)</div></div>"
          : '<div class="rcard rcard--green"><div class="rcard__label">과세 여부</div>' +
            '<div class="rcard__value">면세</div>' +
            '<div class="rcard__sub">퇴직연금·연금계좌 수령 시</div></div>') +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>평균임금 (월)</span><span>' + fmt(o.salary) + "원</span></div>" +
        '<div class="drow"><span>일 평균임금</span><span>' + fmt(r.dailySalary) + "원</span></div>" +
        '<div class="drow"><span>총 근무연수</span><span>' + o.years + "년 (" + Math.round(r.days) + "일)</span></div>" +
        (isMid
          ? '<div class="drow"><span>이미 수령한 퇴직금</span><span>' + fmt(o.already) + "원</span></div>"
          : "") +
        '<div class="drow"><span>계산식</span><span>일평균임금 × 재직일수 ÷ 365 × 30</span></div>' +
        '<div class="drow total"><span>최종 수령액</span><span>' + fmt(r.net) + "원</span></div>" +
      "</div>" +
      '<p class="field__note">⚠️ 본 결과는 <strong>참고용</strong> 근사치입니다. 평균임금 산정 기준, 재직일수, 중간정산 차감액, 퇴직소득세율 등은 실제와 다를 수 있어요. 정확한 금액은 인사·노무 담당자에게 확인하세요.</p>';
  }

  /* ----------------------------------------------------------------
     진입점
  ---------------------------------------------------------------- */
  function calculate(silent) {
    try {
      const o = getInputs();
      if (!o.salary || o.salary <= 0) {
        if (!silent) window.App && window.App.toast("평균임금을 입력해 주세요.", "error");
        return;
      }
      if (!o.years || o.years <= 0) {
        if (!silent) window.App && window.App.toast("근무연수를 입력해 주세요.", "error");
        return;
      }
      const r = calcRetire(o);
      render(o, r);
      if (!silent) window.App && window.App.toast("계산이 완료되었어요! ✅", "ok");
    } catch (e) {
      console.error("retire calculate:", e);
      if (!silent) window.App && window.App.toast("계산 중 오류가 발생했어요. 입력값을 확인해 주세요.", "error");
    }
  }

  window.RetireCalc = { calculate: calculate };
})();
