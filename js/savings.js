/* ============================================================
   compound.js - 복리·적금 계산기
   - 단리 / 복리 (이자 재투자)
   - 월 적립식 (적금) / 거치식 (예금·목돈)
   - 이자소득세 14% 옵션
   ============================================================ */
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n) || 0).toLocaleString("ko-KR");

  const INTEREST_TAX = 0.14; // 이자소득세 14% (+ 농어촌특별세 0.14% 생략, 참고용)

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
    const c = active("[data-ctype]");
    const p = active("[data-ptype]");
    const tx = active("[data-tax]");
    return {
      ctype: c ? c.getAttribute("data-ctype") : "compound",
      ptype: p ? p.getAttribute("data-ptype") : "monthly",
      tax: tx ? tx.getAttribute("data-tax") : "yes",
      monthly: parseNum((q("monthlyAmount") || {}).value),
      lump: parseNum((q("lumpAmount") || {}).value),
      rate: parseNum((q("compoundRate") || {}).value),
      years: parseNum((q("compoundPeriod") || {}).value)
    };
  }

  /* ----------------------------------------------------------------
     복리 계산 (월 복리)
     - 거치식: 원금 × (1 + r/12)^(12*n)
     - 월 적립식: PMT × [ ((1+r/12)^(12n) - 1) / (r/12) ]
  ---------------------------------------------------------------- */
  function calcCompound(o) {
    const r = Math.max(0, o.rate) / 100 / 12; // 월 이율
    const n = Math.max(1, Math.round(o.years * 12)); // 개월 수
    const isMonthly = o.ptype === "monthly";
    const principal = isMonthly ? o.monthly * n : o.lump;

    let total, invested;
    if (isMonthly) {
      const monthly = Math.max(0, o.monthly);
      invested = monthly * n;
      if (r === 0) {
        total = invested;
      } else {
        total = monthly * ((Math.pow(1 + r, n) - 1) / r);
      }
    } else {
      const lump = Math.max(0, o.lump);
      invested = lump;
      total = lump * Math.pow(1 + r, n);
    }

    const grossInterest = total - invested;
    const tax = o.tax === "yes" ? grossInterest * INTEREST_TAX : 0;
    const netInterest = grossInterest - tax;
    const netTotal = invested + netInterest;

    return {
      invested: invested,
      total: total,
      grossInterest: grossInterest,
      tax: tax,
      netInterest: netInterest,
      netTotal: netTotal,
      principal: invested
    };
  }

  /* ----------------------------------------------------------------
     단리 계산
     - 거치식: 원금 × (1 + 연이율 × 년수)
     - 월 적립식: 매월 납입액이 1~n개월 동안 이자 붙음
        이자 = PMT × 연이율/12 × (n + (n-1) + ... + 1) / n ... (월 단리 단순합)
        → 총 이자 = PMT × (월이율) × n(n+1)/2
  ---------------------------------------------------------------- */
  function calcSimple(o) {
    const annual = Math.max(0, o.rate) / 100;
    const n = Math.max(1, Math.round(o.years * 12)); // 개월 수
    const isMonthly = o.ptype === "monthly";
    const mr = annual / 12;

    let invested, total;
    if (isMonthly) {
      const monthly = Math.max(0, o.monthly);
      invested = monthly * n;
      // 적금식 단리: 첫 납입액은 n개월, 둘째는 n-1개월, ... 마지막은 1개월
      const interest = monthly * mr * (n * (n + 1)) / 2;
      total = invested + interest;
    } else {
      const lump = Math.max(0, o.lump);
      invested = lump;
      total = lump * (1 + annual * (n / 12));
    }

    const grossInterest = total - invested;
    const tax = o.tax === "yes" ? grossInterest * INTEREST_TAX : 0;
    const netInterest = grossInterest - tax;
    const netTotal = invested + netInterest;

    return {
      invested: invested,
      total: total,
      grossInterest: grossInterest,
      tax: tax,
      netInterest: netInterest,
      netTotal: netTotal,
      principal: invested
    };
  }

  /* ----------------------------------------------------------------
     렌더링
  ---------------------------------------------------------------- */
  function render(o, r) {
    const host = q("compoundResult");
    if (!host) return;
    const isCompound = o.ctype === "compound";
    const isMonthly = o.ptype === "monthly";
    const title = (isCompound ? "복리" : "단리") + " · " + (isMonthly ? "월 적립식" : "거치식");
    const taxLabel = o.tax === "yes" ? "이자소득세 14%" : "비과세";

    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">' + title + " · " + taxLabel + "</span></h3>" +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">만기 금액 (세후)</div>' +
          '<div class="rcard__value">' + fmt(r.netTotal) + '원</div>' +
          '<div class="rcard__sub">세전 ' + fmt(r.total) + "원</div></div>" +
        '<div class="rcard rcard--green"><div class="rcard__label">총 이자 (세후)</div>' +
          '<div class="rcard__value">' + fmt(r.netInterest) + '원</div>' +
          '<div class="rcard__sub">세전 ' + fmt(r.grossInterest) + "원" +
          (r.tax ? " · 세금 " + fmt(r.tax) + "원" : "") + "</div></div>" +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>납입 원금</span><span>' + fmt(r.invested) + "원</span></div>" +
        (isMonthly
          ? '<div class="drow"><span>월 납입액 × 개월</span><span>' + fmt(o.monthly) + "원 × " + Math.round(o.years * 12) + "개월</span></div>"
          : '<div class="drow"><span>초기 금액</span><span>' + fmt(o.lump) + "원</span></div>") +
        '<div class="drow"><span>적용 이율</span><span>' + o.rate + "% (연)</span></div>" +
        '<div class="drow"><span>운용 기간</span><span>' + o.years + "년</span></div>" +
        '<div class="drow"><span>이자 증가율</span><span>' +
          (r.invested ? ((r.netInterest / r.invested) * 100).toFixed(1) : "0.0") +
          "%</span></div>" +
        '<div class="drow total"><span>총 수령액</span><span>' + fmt(r.netTotal) + "원</span></div>" +
      "</div>" +
      '<p class="field__note">⚠️ 본 결과는 <strong>참고용</strong> 근사치입니다. 금융기관의 이율, 이자 계산 주기(일·월·년), 세금 우대 조건에 따라 실제 수령액은 달라질 수 있어요.</p>';
  }

  /* ----------------------------------------------------------------
     진입점
  ---------------------------------------------------------------- */
  function calculate(silent) {
    try {
      const o = getInputs();
      const isMonthly = o.ptype === "monthly";
      const amount = isMonthly ? o.monthly : o.lump;
      if (!amount || amount <= 0) {
        if (!silent) window.App && window.App.toast("금액을 입력해 주세요.", "error");
        return;
      }
      if (!o.years || o.years <= 0) {
        if (!silent) window.App && window.App.toast("기간을 입력해 주세요.", "error");
        return;
      }
      const r = o.ctype === "compound" ? calcCompound(o) : calcSimple(o);
      render(o, r);
      if (!silent) window.App && window.App.toast("계산이 완료되었어요! ✅", "ok");
    } catch (e) {
      console.error("compound calculate:", e);
      if (!silent) window.App && window.App.toast("계산 중 오류가 발생했어요. 입력값을 확인해 주세요.", "error");
    }
  }

  window.CompoundCalc = { calculate: calculate };
})();
