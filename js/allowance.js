/* ============================================================
   allowance.js - 연차수당 · 주휴수당 시뮬레이터
   - 연차수당: 1일 치 통상임금(월급/21.5) × 미사용 연차
   - 주휴수당: 주당 소정근로시간 기준 (15시간 이상)
   ============================================================ */
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n) || 0).toLocaleString("ko-KR");

  const MONTH_WORK_DAYS = 21.5; // 월 평균 근무일 (근로기준법 상환산 기준)

  function q(id) { return document.getElementById(id); }
  function active(sel) { return document.querySelector(sel + ".active"); }

  function parseNum(str, def) {
    if (typeof str === "number") return str;
    const n = parseFloat(String(str || "").replace(/[^0-9.\-]/g, ""));
    return isNaN(n) ? (def === undefined ? 0 : def) : n;
  }

  /* ----------------------------------------------------------------
     연차수당
     - 1일 치 통상임금 = 월 통상임금 ÷ 21.5
     - 연차수당 = 1일 치 통상임금 × 미사용 연차 일수
     - 1년 미만/1주일 개근 시 발생 연차: 11일 (2025년 기준, 근로기준법 제60조)
  ---------------------------------------------------------------- */
  function calcAnnual(o) {
    const daily = o.salary / MONTH_WORK_DAYS;
    const remaining = Math.max(0, o.totalDays - o.usedDays);
    const amount = daily * remaining;
    // 5일 이상 미사용 시 회사에 사용 촉진 의무 (10일)
    return {
      daily: daily,
      remaining: remaining,
      amount: amount,
      monthlyEquivalent: daily * MONTH_WORK_DAYS
    };
  }

  /* ----------------------------------------------------------------
     주휴수당
     - 대상: 1주 15시간 이상 근로 시 주휴일 유급
     - 주휴수당 = 시급 × (주당 소정근로시간 / 7) × 주휴일수
     - 여기서는 월 환산: 시급 × 일일시간 × 월근무일 ÷ 7 × 1 (주휴일 1일)
  ---------------------------------------------------------------- */
  function calcWeekly(o) {
    const weeklyHours = (o.hours || 0) * (o.daysPerWeek || 0);
    const weeklyPay = o.hourly * weeklyHours;
    // 근로기준법 제54조: 1주 15시간 이상 근로 시 주당 1일 유급주휴
    const eligible = weeklyHours >= 15;
    // 주휴수당(1주) = 시급 × (주 소정근로시간 ÷ 7)
    const weeklyAllowance = eligible ? o.hourly * (weeklyHours / 7) : 0;
    const monthly = weeklyAllowance * 4.345; // 주→월 환산
    return {
      weeklyHours: weeklyHours,
      weeklyPay: weeklyPay,
      eligible: eligible,
      weeklyAllowance: weeklyAllowance,
      monthly: monthly,
      grossMonthly: weeklyPay * 4.345 + monthly
    };
  }

  /* ----------------------------------------------------------------
     렌더링
  ---------------------------------------------------------------- */
  function renderAnnual(o, r) {
    const host = q("allowanceResult");
    if (!host) return;
    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">연차수당</span></h3>' +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">예상 연차수당</div>' +
          '<div class="rcard__value">' + fmt(r.amount) + '원</div>' +
          '<div class="rcard__sub">미사용 연차 ' + r.remaining + '일</div></div>' +
        '<div class="rcard rcard--green"><div class="rcard__label">1일 치 통상임금</div>' +
          '<div class="rcard__value">' + fmt(r.daily) + '원</div>' +
          '<div class="rcard__sub">월급 ÷ 21.5일</div></div>' +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>월 통상임금</span><span>' + fmt(o.salary) + "원</span></div>" +
        '<div class="drow"><span>총 발생 연차</span><span>' + o.totalDays + "일</span></div>" +
        '<div class="drow"><span>이미 사용 연차</span><span>' + o.usedDays + "일</span></div>" +
        '<div class="drow"><span>미사용 연차</span><span>' + r.remaining + "일</span></div>" +
        '<div class="drow"><span>계산식</span><span>(월급 ÷ 21.5) × 미사용 연차</span></div>' +
        '<div class="drow total"><span>총 수령액</span><span>' + fmt(r.amount) + "원</span></div>" +
      "</div>" +
      '<p class="field__note">💡 <strong>알아두면 좋은 팁:</strong> 1년간 80% 이상 출근하면 만 11일의 연차가 발생해요. 미사용 연차는 퇴사 시 반드시 금전으로 정산받을 수 있어요.</p>';
  }

  function renderWeekly(o, r) {
    const host = q("allowanceResult");
    if (!host) return;
    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">주휴수당</span></h3>' +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">월 주휴수당</div>' +
          '<div class="rcard__value">' + fmt(r.monthly) + '원</div>' +
          '<div class="rcard__sub">주당 ' + fmt(r.weeklyAllowance) + "원 × 4.345주</div></div>" +
        '<div class="rcard rcard--green"><div class="rcard__label">월 예상 총액</div>' +
          '<div class="rcard__value">' + fmt(r.grossMonthly) + '원</div>' +
          '<div class="rcard__sub">근로소득 + 주휴수당</div></div>' +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>시급</span><span>' + fmt(o.hourly) + "원</span></div>" +
        '<div class="drow"><span>일일 근로시간</span><span>' + o.hours + "시간</span></div>" +
        '<div class="drow"><span>주당 근로시간</span><span>' + r.weeklyHours.toFixed(1) + "시간</span></div>" +
        '<div class="drow"><span>주휴수당 지급 대상</span><span>' +
          (r.eligible ? "✅ 대상 (주 15시간 이상)" : "❌ 미달 (주 15시간 미만)") + "</span></div>" +
        '<div class="drow"><span>계산식</span><span>시급 × (주 소정근로시간 ÷ 7)</span></div>' +
        '<div class="drow total"><span>월 총액</span><span>' + fmt(r.grossMonthly) + "원</span></div>" +
      "</div>" +
      '<p class="field__note">💡 <strong>알아두면 좋은 팁:</strong> 주휴수당은 일주일에 하루 이상 쉬고 15시간 이상 일하면 받을 수 있어요. 시급이 올라도 주휴수당은 <strong>소정근로시간</strong>을 기준으로 계산돼요.</p>';
  }

  /* ----------------------------------------------------------------
     진입점
  ---------------------------------------------------------------- */
  function calculate(silent) {
    try {
      const t = active("[data-atype]");
      const mode = t ? t.getAttribute("data-atype") : "annual";
      if (mode === "annual") {
        const o = {
          salary: parseNum((q("aSalary") || {}).value),
          totalDays: parseNum((q("aTotalDays") || {}).value, 15),
          usedDays: parseNum((q("aUsedDays") || {}).value, 0)
        };
        if (!o.salary || o.salary <= 0) {
          if (!silent) window.App && window.App.toast("월 통상임금을 입력해 주세요.", "error");
          return;
        }
        renderAnnual(o, calcAnnual(o));
      } else {
        const o = {
          hourly: parseNum((q("wHourlyPay") || {}).value),
          hours: parseNum((q("wHours") || {}).value, 8),
          daysPerWeek: parseNum((q("wDays") || {}).value, 5)
        };
        if (!o.hourly || o.hourly <= 0) {
          if (!silent) window.App && window.App.toast("시급을 입력해 주세요.", "error");
          return;
        }
        renderWeekly(o, calcWeekly(o));
      }
      if (!silent) window.App && window.App.toast("계산이 완료되었어요! ✅", "ok");
    } catch (e) {
      console.error("allowance calculate:", e);
      if (!silent) window.App && window.App.toast("계산 중 오류가 발생했어요.", "error");
    }
  }

  window.AllowanceCalc = { calculate: calculate };
})();
