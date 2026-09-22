/* ============================================================
   loan.js - 대출 이자 계산기
   - 원리금균등 / 원금균등 / 만기일시 상환
   - 거치 기간(원금 상환 유예) 지원
   - 중도상환수수료 안내
   - SVG 차트 + 월별 스케줄 표 + CSV 내보내기
   ============================================================ */
(function () {
  "use strict";

  const fmt = (n) => (Math.round(n) || 0).toLocaleString("ko-KR");

  /* ----------------------------------------------------------------
     입력 파싱
  ---------------------------------------------------------------- */
  function parseNum(str, def) {
    if (typeof str === "number") return str;
    const n = parseFloat(String(str || "").replace(/[^0-9.\-]/g, ""));
    return isNaN(n) ? (def === undefined ? 0 : def) : n;
  }

  function getLoanInputs() {
    const methodEl = document.querySelector("#methodGroup .seg__btn.active") ||
      document.querySelector("[data-method].active");
    return {
      type: (document.getElementById("loanType") || {}).value || "mortgage",
      method: methodEl ? methodEl.getAttribute("data-method") : "equal",
      amount: parseNum(document.getElementById("loanAmount").value),
      rate: parseNum(document.getElementById("loanRate").value),
      years: parseNum(document.getElementById("loanPeriod").value),
      grace: parseNum(document.getElementById("gracePeriod").value),
      fee: parseNum(document.getElementById("prepayFee").value)
    };
  }

  /* ----------------------------------------------------------------
     상환 방식별 스케줄 생성
     반환: { rows: [{pay, principal, interest, balance}], totalInterest, totalPay }
  ---------------------------------------------------------------- */
  function buildSchedule(o) {
    const P = Math.max(0, o.amount);
    const annualRate = Math.max(0, o.rate) / 100;
    const r = annualRate / 12;                   // 월 이율
    const totalMonths = Math.max(1, Math.round(o.years * 12));
    const graceMonths = Math.max(0, Math.min(totalMonths - 1, Math.round(o.grace * 12)));
    const payMonths = totalMonths - graceMonths; // 실제 원금 상환 개월

    const rows = [];
    let balance = P;
    let totalInterest = 0;

    // 1) 거치 기간: 이자만 납부
    for (let i = 0; i < graceMonths; i++) {
      const interest = balance * r;
      balance -= 0;
      totalInterest += interest;
      rows.push({ pay: interest, principal: 0, interest: interest, balance: balance });
    }

    if (o.method === "equal") {
      // 원리금균등상환
      let fixed = 0;
      if (r === 0) {
        fixed = balance / payMonths;
      } else {
        fixed = (balance * r) / (1 - Math.pow(1 + r, -payMonths));
      }
      for (let i = 0; i < payMonths; i++) {
        const interest = balance * r;
        let principal = fixed - interest;
        if (principal > balance) principal = balance;
        balance -= principal;
        totalInterest += interest;
        rows.push({ pay: principal + interest, principal: principal, interest: interest, balance: Math.max(0, balance) });
      }
    } else if (o.method === "principal") {
      // 원금균등상환
      const monthlyPrincipal = balance / payMonths;
      for (let i = 0; i < payMonths; i++) {
        const interest = balance * r;
        let principal = monthlyPrincipal;
        if (principal > balance) principal = balance;
        balance -= principal;
        totalInterest += interest;
        rows.push({ pay: principal + interest, principal: principal, interest: interest, balance: Math.max(0, balance) });
      }
    } else {
      // 만기일시상환 (거치 종료 후 만기까지 이자만, 만기에 원금 일괄)
      for (let i = 0; i < payMonths; i++) {
        const interest = balance * r;
        totalInterest += interest;
        const isLast = i === payMonths - 1;
        const principal = isLast ? balance : 0;
        balance -= principal;
        rows.push({ pay: interest + principal, principal: principal, interest: interest, balance: Math.max(0, balance) });
      }
    }

    return {
      rows: rows,
      totalInterest: totalInterest,
      totalPay: P + totalInterest,
      principal: P
    };
  }

  /* ----------------------------------------------------------------
     결과 렌더링
  ---------------------------------------------------------------- */
  function render(o, sched) {
    const host = document.getElementById("loanResult");
    if (!host || !sched || !sched.rows || !sched.rows.length) return;
    const months = sched.rows.length;
    const avgPay =
      o.method === "equal"
        ? sched.rows.reduce((a, x) => (x.principal > 0 ? a + x.pay : a), 0) /
          Math.max(1, sched.rows.filter((x) => x.principal > 0).length)
        : sched.rows[months - 1]
        ? sched.rows.reduce((a, x) => a + x.pay, 0) / months
        : 0;

    const firstPay = sched.rows[0] ? sched.rows[0].pay : 0;
    const lastPay = sched.rows[months - 1] ? sched.rows[months - 1].pay : 0;
    const feeAmount = (o.amount * Math.max(0, o.fee)) / 100;
    const totalRatio = o.amount ? (sched.totalPay / o.amount) * 100 : 0;

    const methodLabel = {
      equal: "원리금균등상환",
      principal: "원금균등상환",
      bullet: "만기일시상환"
    }[o.method];
    const typeLabel = o.type === "mortgage" ? "주택담보대출" : "신용대출";

    host.innerHTML =
      '<h3 class="panel__title">계산 결과 <span class="badge">' + methodLabel + " · " + typeLabel + "</span></h3>" +
      '<div class="result-cards">' +
        '<div class="rcard rcard--primary"><div class="rcard__label">월 상환액 (평균)</div>' +
          '<div class="rcard__value">' + fmt(avgPay) + '원</div>' +
          '<div class="rcard__sub">첫 회 ' + fmt(firstPay) + "원 → 마지막 " + fmt(lastPay) + "원</div></div>" +
        '<div class="rcard rcard--green"><div class="rcard__label">총 이자</div>' +
          '<div class="rcard__value">' + fmt(sched.totalInterest) + '원</div>' +
          '<div class="rcard__sub">원금 대비 ' + ((sched.totalInterest / Math.max(1, o.amount)) * 100).toFixed(1) + "%</div></div>" +
      "</div>" +
      '<div class="result-detail">' +
        '<h4>상세 내역</h4>' +
        '<div class="drow"><span>대출 원금</span><span>' + fmt(o.amount) + "원</span></div>" +
        '<div class="drow"><span>총 상환액 (원금+이자)</span><span>' + fmt(sched.totalPay) + "원</span></div>" +
        '<div class="drow"><span>상환 기간</span><span>' + o.years + "년 (" + months + "개월)" + (o.grace ? " · 거치 " + o.grace + "년" : "") + "</span></div>" +
        '<div class="drow"><span>연이율</span><span>' + o.rate + "%</span></div>" +
        '<div class="drow"><span>총 상환 / 원금</span><span>' + totalRatio.toFixed(1) + "%</span></div>" +
        (feeAmount
          ? '<div class="drow"><span>중도상환수수료 (안내)</span><span>' + fmt(feeAmount) + "원</span></div>"
          : "") +
        '<div class="drow total"><span>월별 상환액 범위</span><span>' + fmt(Math.min(firstPay, lastPay)) + " ~ " + fmt(Math.max(firstPay, lastPay)) + "원</span></div>" +
      "</div>" +
      '<div class="chart-box"><h4>누적 원금 / 이자 추이</h4><svg class="chart" id="loanChart" viewBox="0 0 600 190" preserveAspectRatio="none"></svg>' +
      '<div class="chart-legend"><span><i style="background:var(--c-primary)"></i> 누적 원금</span><span><i style="background:var(--c-accent)"></i> 누적 이자</span></div></div>';

    renderChart(sched);
    renderTable(o, sched);
  }

  function renderChart(sched) {
    const svg = document.getElementById("loanChart");
    if (!svg) return;
    const W = 600, H = 190, padL = 8, padB = 8, padT = 8;
    const n = sched.rows.length;
    let cumP = 0, cumI = 0;
    const ptsP = [], ptsI = [];
    let maxV = 1;

    sched.rows.forEach((row, i) => {
      cumP += row.principal;
      cumI += row.interest;
      const x = padL + (i / Math.max(1, n - 1)) * (W - padL * 2);
      ptsP.push([x, cumP]);
      ptsI.push([x, cumI]);
      if (cumP + cumI > maxV) maxV = cumP + cumI;
    });

    function y(v) {
      return H - padB - (v / maxV) * (H - padB - padT);
    }

    function path(points) {
      return points
        .map((p, i) => (i === 0 ? "M" + p[0] + " " + y(p[1]) : "L" + p[0] + " " + y(p[1])))
        .join(" ");
    }

    function area(points) {
      if (!points.length) return "";
      const base = H - padB;
      return path(points) + " L" + points[points.length - 1][0] + " " + base + " L" + points[0][0] + " " + base + " Z";
    }

    if (!ptsP.length) {
      svg.innerHTML = "";
      return;
    }

    svg.innerHTML =
      '<path d="' + area(ptsI) + '" fill="rgba(255,158,109,.18)"/>' +
      '<path d="' + area(ptsP) + '" fill="rgba(91,141,239,.15)"/>' +
      '<path d="' + path(ptsI) + '" fill="none" stroke="#ff9e6d" stroke-width="2"/>' +
      '<path d="' + path(ptsP) + '" fill="none" stroke="#5b8def" stroke-width="2"/>';
  }

  function renderTable(o, sched) {
    const wrap = document.getElementById("loanScheduleWrap");
    if (!wrap) return;
    const tbody = wrap.querySelector("tbody");
    if (!tbody) return;
    const showAllEl = document.getElementById("showAllRows");
    const showAll = showAllEl ? showAllEl.checked : true;

    let html = "";
    sched.rows.forEach((row, i) => {
      const idx = i + 1;
      if (!showAll && idx > 12 && idx <= sched.rows.length - 12 && idx % 12 !== 0) return;
      html +=
        "<tr><td>" + idx + "</td><td>" + fmt(row.pay) + "원</td><td>" + fmt(row.principal) +
        "원</td><td>" + fmt(row.interest) + "원</td><td>" + fmt(row.balance) + "원</td></tr>";
    });
    tbody.innerHTML = html;

    const tfoot = wrap.querySelector("tfoot");
    if (!tfoot) {
      const table = document.getElementById("loanTable");
      const tf = document.createElement("tfoot");
      tf.innerHTML =
        "<tr><td>합계</td><td>" + fmt(sched.totalPay) + "원</td><td>" + fmt(sched.principal) +
        "원</td><td>" + fmt(sched.totalInterest) + "원</td><td>-</td></tr>";
      table.appendChild(tf);
    } else {
      tfoot.innerHTML =
        "<tr><td>합계</td><td>" + fmt(sched.totalPay) + "원</td><td>" + fmt(sched.principal) +
        "원</td><td>" + fmt(sched.totalInterest) + "원</td><td>-</td></tr>";
    }
    wrap.classList.remove("hidden");
  }

  function exportCSV(o, sched) {
    const rows = [["회차", "월 상환액", "원금", "이자", "잔액"]];
    sched.rows.forEach((row, i) => {
      rows.push([i + 1, Math.round(row.pay), Math.round(row.principal), Math.round(row.interest), Math.round(row.balance)]);
    });
    // UTF-8 BOM for Excel (엑셀에서 한글 깨짐 방지)
    const BOM = String.fromCharCode(0xfeff);
    const csv = BOM + rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "대출상환스케줄.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ----------------------------------------------------------------
     진입점
  ---------------------------------------------------------------- */
  let last = null;

  function calculate(silent) {
    try {
      const o = getLoanInputs();
      if (!o.amount || o.amount <= 0) {
        if (!silent) window.App && window.App.toast("대출 원금을 입력해 주세요.", "error");
        return;
      }
      if (!o.years || o.years <= 0) {
        if (!silent) window.App && window.App.toast("상환 기간을 입력해 주세요.", "error");
        return;
      }
      const sched = buildSchedule(o);
      last = { options: o, schedule: sched };
      render(o, sched);
      if (!silent) window.App && window.App.toast("계산이 완료되었어요! ✅", "ok");
    } catch (e) {
      console.error("loan calculate:", e);
      if (!silent) window.App && window.App.toast("계산 중 오류가 발생했어요. 입력값을 확인해 주세요.", "error");
    }
  }

  function refresh() {
    if (last && document.getElementById("showAllRows")) {
      render(last.options, last.schedule);
    }
  }

  window.LoanCalc = {
    calculate: calculate,
    refresh: refresh,
    exportCSV: function () {
      if (!last) return;
      exportCSV(last.options, last.schedule);
    }
  };
})();
