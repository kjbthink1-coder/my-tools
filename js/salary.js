/* ============================================================
   salary.js - 연봉 실수령액 계산기
   - 직장인 (4대보험 + 근로소득세 연말정산 기준)
   - 프리랜서 (사업소득: 일반 3~40% / 기타 21.5%)
   - 연봉→월실수령액 / 월급→연봉 역산
   2025년 세제 기준 (참고용)
   ============================================================ */
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n) || 0).toLocaleString("ko-KR");

  /* ----------------------------------------------------------------
     세율표 (2025년)
  ---------------------------------------------------------------- */
  // 근로소득 세율 (과세표준액 기준, 누진공제 포함)
  const TAX_TABLE = [
    { upTo: 14000000, rate: 0.06, deduct: 0 },
    { upTo: 50000000, rate: 0.15, deduct: 1260000 },
    { upTo: 88000000, rate: 0.24, deduct: 5760000 },
    { upTo: 150000000, rate: 0.35, deduct: 15440000 },
    { upTo: 300000000, rate: 0.38, deduct: 19940000 },
    { upTo: 500000000, rate: 0.40, deduct: 25940000 },
    { upTo: 1000000000, rate: 0.42, deduct: 35940000 },
    { upTo: Infinity, rate: 0.45, deduct: 65940000 }
  ];

  // 사업소득(일반) 세율
  const BIZ_TABLE = [
    { upTo: 12000000, rate: 0.06, deduct: 0 },
    { upTo: 46000000, rate: 0.15, deduct: 1080000 },
    { upTo: 88000000, rate: 0.24, deduct: 5220000 },
    { upTo: 150000000, rate: 0.35, deduct: 14900000 },
    { upTo: Infinity, rate: 0.38, deduct: 19400000 }
  ];

  const OTHER_BIZ_RATE = 0.215; // 기타 사업소득 분리과세 21.5%

  // 4대보험료율 (2025년, 근로자 부담)
  const INS = {
    pension: 0.045,      // 국민연금 4.5%
    health: 0.03545,     // 건강보험 3.545%
    employ: 0.009,       // 고용보험 0.9% (사무직)
    longtermRatio: 0.3594, // 노인장기요양 = 건강보험료의 35.94%
    nurtureRatio: 0.2539  // 돌봄보험   = 건강보험료의 25.39%
  };

  const PENSION_CAP = 6580000 * 12; // 2025년 국민연금 상한 (월 658만원)

  // 근로소득공제
  function earnedIncomeDeduction(total) {
    if (total <= 16000000) return total * 0.7;
    if (total <= 30000000) return 11200000 + (total - 16000000) * 0.5;
    if (total <= 45000000) return 18200000 + (total - 30000000) * 0.4;
    if (total <= 70000000) return 24200000 + (total - 45000000) * 0.3;
    if (total <= 120000000) return 31700000 + (total - 70000000) * 0.2;
    if (total <= 200000000) return 41700000 + (total - 120000000) * 0.1;
    return 49700000 + (total - 200000000) * 0.05;
  }

  function progressiveTax(taxBase, table) {
    for (let i = 0; i < table.length; i++) {
      if (taxBase <= table[i].upTo) {
        return taxBase * table[i].rate - table[i].deduct;
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

  function getInputs() {
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => q(sel + ".active");
    const w = qa("[data-worker]");
    const m = qa("[data-mode]");
    const f = qa("[data-ftype]");
    const dep = q("#dependents");
    const non = q("#nonTaxIncome");
    return {
      worker: w ? w.getAttribute("data-worker") : "employee",
      mode: m ? m.getAttribute("data-mode") : "annual",
      ftype: f ? f.getAttribute("data-ftype") : "general",
      input: parseNum((q("#salaryInput") || {}).value),
      dependents: dep ? parseNum(dep.value, 1) : 1,
      nonTax: non ? parseNum(non.value, 0) : 0
    };
  }

  /* ----------------------------------------------------------------
     직장인 계산
  ---------------------------------------------------------------- */
  function calcEmployee(o) {
    const monthlyNonTax = o.nonTax || 0;
    const annualNonTax = monthlyNonTax * 12;

    let annualGross, monthlyGross;
    if (o.mode === "annual") {
      annualGross = o.input;
      monthlyGross = annualGross / 12;
    } else {
      monthlyGross = o.input;
      annualGross = monthlyGross * 12;
    }

    const monthlyTaxable = Math.max(0, monthlyGross - monthlyNonTax);
    const annualTaxable = monthlyTaxable * 12;

    // 4대보험 (과세표준 = 과세임금 기준)
    const insPension = Math.min(PENSION_CAP, annualTaxable) * INS.pension;
    const insHealth = annualTaxable * INS.health;
    const insLongterm = insHealth * INS.longtermRatio;
    const insNurture = insHealth * INS.nurtureRatio;
    const insEmploy = annualTaxable * INS.employ;
    const insTotal = insPension + insHealth + insLongterm + insNurture + insEmploy;

    // 소득공제
    const earnedDeduction = earnedIncomeDeduction(annualTaxable);
    const personalDeduction = Math.max(1, o.dependents) * 1500000;
    const standardDeduction =
      120000 + insHealth + insLongterm + insNurture + insPension + insEmploy;

    const taxBase = Math.max(0, annualTaxable - earnedDeduction - personalDeduction - standardDeduction);
    const incomeTax = Math.max(0, progressiveTax(taxBase, TAX_TABLE));
    const localTax = incomeTax * 0.1;
    const taxTotal = incomeTax + localTax;

    const annualNet = annualGross - insTotal - taxTotal;
    const monthlyNet = annualNet / 12;

    return {
      annualGross: annualGross,
      monthlyGross: monthlyGross,
      annualTaxable: annualTaxable,
      insurances: {
        pension: insPension,
        health: insHealth + insLongterm + insNurture,
        employ: insEmploy
      },
      insTotal: insTotal,
      taxBase: taxBase,
      incomeTax: incomeTax,
      localTax: localTax,
      taxTotal: taxTotal,
      annualNet: annualNet,
      monthlyNet: monthlyNet,
      netRatio: annualGross ? (annualNet / annualGross) * 100 : 0
    };
  }

  /* ----------------------------------------------------------------
     프리랜서(사업소득) 계산
  ---------------------------------------------------------------- */
  function calcFreelancer(o) {
    const totalRevenue = o.input; // 연간 총수입금액
    const annualTaxable = totalRevenue;

    let incomeTax, note;
    if (o.ftype === "other") {
      incomeTax = annualTaxable * OTHER_BIZ_RATE;
      note = "기타 사업소득 분리과세 21.5%";
    } else {
      incomeTax = Math.max(0, progressiveTax(annualTaxable, BIZ_TABLE));
      note = "일반 사업소득 3~40% 누진세율";
    }
    const localTax = incomeTax * 0.1;
    const taxTotal = incomeTax + localTax;

    const annualNet = totalRevenue - taxTotal;
    const monthlyNet = annualNet / 12;
    const monthlyGross = totalRevenue / 12;

    return {
      annualGross: totalRevenue,
      monthlyGross: monthlyGross,
      annualTaxable: annualTaxable,
      insurances: { pension: 0, health: 0, employ: 0 },
      insTotal: 0,
      taxBase: annualTaxable,
      incomeTax: incomeTax,
      localTax: localTax,
      taxTotal: taxTotal,
      annualNet: annualNet,
      monthlyNet: monthlyNet,
      netRatio: totalRevenue ? (annualNet / totalRevenue) * 100 : 0,
      note: note
    };
  }

  /* ----------------------------------------------------------------
     렌더링
  ---------------------------------------------------------------- */
  function render(o, r) {
    const host = document.getElementById("salaryResult");
    if (!host) return;
    const isFree = o.worker === "freelancer";
    const title = isFree ? "프리랜서 (사업소득)" : "직장인 (4대보험)";
    const modeLabel = o.mode === "annual" ? "연봉 → 월 실수령액" : "월급 → 연봉 역산";

    let detailRows = "";
    if (isFree) {
      detailRows =
        '<div class="drow"><span>과세 방식</span><span>' + (r.note || "-") + "</span></div>";
    } else {
      detailRows =
        '<div class="drow"><span>국민연금 (4.5%)</span><span>' + fmt(r.insurances.pension) + "원</span></div>" +
        '<div class="drow"><span>건강보험·요양·돌봄</span><span>' + fmt(r.insurances.health) + "원</span></div>" +
        '<div class="drow"><span>고용보험 (0.9%)</span><span>' + fmt(r.insurances.employ) + "원</span></div>";
    }

    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">' + title + " · " + modeLabel + "</span></h3>" +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">월 실수령액</div>' +
          '<div class="rcard__value">' + fmt(r.monthlyNet) + '원</div>' +
          '<div class="rcard__sub">연 ' + fmt(r.annualNet) + "원 · 실수령률 " + r.netRatio.toFixed(1) + "%</div></div>" +
        '<div class="rcard rcard--green"><div class="rcard__label">총 공제액</div>' +
          '<div class="rcard__value">' + fmt(r.insTotal + r.taxTotal) + '원</div>' +
          '<div class="rcard__sub">보험 ' + fmt(r.insTotal) + " + 세금 " + fmt(r.taxTotal) + "</div></div>" +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>' + (o.mode === "annual" ? "연봉 (세전)" : "역산 연봉") + '</span><span>' + fmt(r.annualGross) + "원</span></div>" +
        '<div class="drow"><span>월급여 (세전)</span><span>' + fmt(r.monthlyGross) + "원</span></div>" +
        detailRows +
        '<div class="drow"><span>소득세</span><span>' + fmt(r.incomeTax) + "원</span></div>" +
        '<div class="drow"><span>지방소득세 (10%)</span><span>' + fmt(r.localTax) + "원</span></div>" +
        '<div class="drow total"><span>총 세금·보험</span><span>' + fmt(r.insTotal + r.taxTotal) + "원</span></div>" +
      "</div>" +
      '<p class="field__note">⚠️ 본 결과는 2025년 세제 기준의 <strong>참고용</strong> 근사치입니다. 연말정산 공제 항목(주택자금, 월세, 의료비 등)에 따라 실제 납부액은 달라질 수 있어요.</p>';
  }

  /* ----------------------------------------------------------------
     진입점
  ---------------------------------------------------------------- */
  function calculate(silent) {
    try {
      const o = getInputs();
      if (!o.input || o.input <= 0) {
        if (!silent) window.App && window.App.toast("금액을 입력해 주세요.", "error");
        return;
      }
      const r = o.worker === "freelancer" ? calcFreelancer(o) : calcEmployee(o);
      render(o, r);
      if (!silent) window.App && window.App.toast("계산이 완료되었어요! ✅", "ok");
    } catch (e) {
      console.error("salary calculate:", e);
      if (!silent) window.App && window.App.toast("계산 중 오류가 발생했어요. 입력값을 확인해 주세요.", "error");
    }
  }

  window.SalaryCalc = { calculate: calculate };
})();
