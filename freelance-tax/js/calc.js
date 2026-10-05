/**
 * freelance-tax/js/calc.js
 * 프리랜서 3.3% 계산기, 역산기, 5월 종합소득세 간이 판정기
 */

(function () {
  // Utility: Number formatting
  function formatNum(n) {
    if (isNaN(n) || n === null || n === undefined) return "0";
    return Math.round(n).toLocaleString("ko-KR");
  }

  function parseNum(str) {
    if (!str) return 0;
    const clean = String(str).replace(/[^\d]/g, "");
    return Number(clean) || 0;
  }

  // Toast notification
  function showToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // Tab switching
  const tabs = document.querySelectorAll(".calc-tab");
  const panels = document.querySelectorAll(".calc-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const activePanel = document.getElementById(target);
      if (activePanel) activePanel.classList.add("active");
    });
  });

  // ============================================================
  // TAB 1: 세전 ➔ 실수령액 계산 (Gross to Net)
  // ============================================================
  const grossInput = document.getElementById("grossAmount");
  const grossBtns = document.querySelectorAll("[data-add-gross]");

  function calculateGrossToNet() {
    const gross = parseNum(grossInput.value);

    // 원천징수 소득세 3% (10원 단위 절사 규정 준수)
    const incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    // 지방소득세: 소득세의 10% (10원 단위 절사)
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    const totalTax = incomeTax + localTax;
    const net = Math.max(0, gross - totalTax);
    const taxRate = gross > 0 ? ((totalTax / gross) * 100).toFixed(2) : "3.30";

    document.getElementById("t1GrossVal").textContent = formatNum(gross) + "원";
    document.getElementById("t1IncomeTax").textContent = "-" + formatNum(incomeTax) + "원";
    document.getElementById("t1LocalTax").textContent = "-" + formatNum(localTax) + "원";
    document.getElementById("t1TotalTax").textContent = "-" + formatNum(totalTax) + "원 (" + taxRate + "%)";
    document.getElementById("t1NetVal").textContent = formatNum(net) + "원";
  }

  if (grossInput) {
    grossInput.addEventListener("input", (e) => {
      const val = parseNum(e.target.value);
      e.target.value = val ? formatNum(val) : "";
      calculateGrossToNet();
    });
  }

  grossBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const add = Number(btn.getAttribute("data-add-gross"));
      const curr = parseNum(grossInput.value);
      grossInput.value = formatNum(curr + add);
      calculateGrossToNet();
    });
  });

  const grossReset = document.getElementById("grossReset");
  if (grossReset) {
    grossReset.addEventListener("click", () => {
      grossInput.value = "";
      calculateGrossToNet();
    });
  }

  // ============================================================
  // TAB 2: 희망 실수령액 ➔ 세전 계약금 역산 (Net to Gross)
  // ============================================================
  const netInput = document.getElementById("targetNet");
  const netBtns = document.querySelectorAll("[data-add-net]");
  const roundOption = document.getElementById("roundOption");
  const copyRequestBtn = document.getElementById("copyRequestBtn");

  function calculateNetToGross() {
    const desiredNet = parseNum(netInput.value);
    if (desiredNet <= 0) {
      document.getElementById("t2GrossVal").textContent = "0원";
      document.getElementById("t2TotalTax").textContent = "-0원";
      document.getElementById("t2IncomeTax").textContent = "-0원";
      document.getElementById("t2LocalTax").textContent = "-0원";
      document.getElementById("t2NetVal").textContent = "0원";
      updateCopyTemplate(0, 0, 0);
      return;
    }

    function getNet(g) {
      const inc = Math.floor((g * 0.03) / 10) * 10;
      const loc = Math.floor((inc * 0.1) / 10) * 10;
      return g - (inc + loc);
    }

    // 기본 공식: 세전 = 희망실수령 / 0.967
    let baseGross = Math.ceil(desiredNet / 0.967);
    while (getNet(baseGross) < desiredNet) {
      baseGross++;
    }

    // 절사/올림 옵션 반영
    const opt = roundOption ? roundOption.value : "ceil10";
    let finalGross = baseGross;

    if (opt === "ceil10") {
      finalGross = Math.ceil(baseGross / 10) * 10;
    } else if (opt === "ceil100") {
      finalGross = Math.ceil(baseGross / 100) * 100;
    } else if (opt === "ceil1000") {
      finalGross = Math.ceil(baseGross / 1000) * 1000;
    } else if (opt === "exact") {
      finalGross = baseGross;
    }

    // 검증 계산
    const incomeTax = Math.floor((finalGross * 0.03) / 10) * 10;
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    const totalTax = incomeTax + localTax;
    const actualNet = finalGross - totalTax;

    document.getElementById("t2GrossVal").textContent = formatNum(finalGross) + "원";
    document.getElementById("t2TotalTax").textContent = "-" + formatNum(totalTax) + "원 (3.3%)";
    document.getElementById("t2IncomeTax").textContent = "-" + formatNum(incomeTax) + "원";
    document.getElementById("t2LocalTax").textContent = "-" + formatNum(localTax) + "원";
    document.getElementById("t2NetVal").textContent = formatNum(actualNet) + "원";

    updateCopyTemplate(finalGross, totalTax, desiredNet);
  }

  function updateCopyTemplate(gross, tax, desired) {
    const preview = document.getElementById("requestTextPreview");
    if (!preview) return;
    if (gross <= 0) {
      preview.textContent = "금액을 입력하면 클라이언트 전달용 청구 문구가 자동으로 생성됩니다.";
      return;
    }
    preview.textContent = `안녕하세요. 합의된 실수령액 ${formatNum(desired)}원을 위해 원천징수 3.3%(${formatNum(tax)}원)가 포함된 세전 계약금액 ${formatNum(gross)}원으로 정산 요청드립니다. 감사합니다.`;
  }

  if (netInput) {
    netInput.addEventListener("input", (e) => {
      const val = parseNum(e.target.value);
      e.target.value = val ? formatNum(val) : "";
      calculateNetToGross();
    });
  }

  if (roundOption) {
    roundOption.addEventListener("change", calculateNetToGross);
  }

  netBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const add = Number(btn.getAttribute("data-add-net"));
      const curr = parseNum(netInput.value);
      netInput.value = formatNum(curr + add);
      calculateNetToGross();
    });
  });

  const netReset = document.getElementById("netReset");
  if (netReset) {
    netReset.addEventListener("click", () => {
      netInput.value = "";
      calculateNetToGross();
    });
  }

  if (copyRequestBtn) {
    copyRequestBtn.addEventListener("click", () => {
      const preview = document.getElementById("requestTextPreview");
      if (!preview || preview.textContent.includes("금액을 입력하면")) {
        showToast("먼저 희망 금액을 입력해 주세요.");
        return;
      }
      navigator.clipboard.writeText(preview.textContent).then(
        () => showToast("📋 청구 문구가 클립보드에 복사되었습니다!"),
        () => showToast("복사에 실패했습니다. 직접 복사해 주세요.")
      );
    });
  }

  // ============================================================
  // TAB 3: 5월 종합소득세 간이 환급 판독기
  // ============================================================
  const annualIncomeInput = document.getElementById("annualIncome");
  const jobSelect = document.getElementById("jobCategory");
  const customRateWrap = document.getElementById("customRateWrap");
  const customRateInput = document.getElementById("customRate");

  // 업종별 단순경비율 기본 데이터 (국세청 단순경비율 통계 기준)
  const jobRates = {
    general: 64.1, // 일반 프리랜서/자영업 (940909 등)
    developer: 64.1, // 프로그래머/IT (940909)
    designer: 64.1, // 시각/웹 디자이너
    writer: 58.7, // 작가/번역가 (940100)
    tutor: 61.7, // 학원/과외 강사 (940903)
    creator: 64.1, // 유튜버/크리에이터
    custom: 64.1
  };

  if (jobSelect) {
    jobSelect.addEventListener("change", () => {
      if (jobSelect.value === "custom") {
        if (customRateWrap) customRateWrap.style.display = "block";
      } else {
        if (customRateWrap) customRateWrap.style.display = "none";
      }
      calculateTaxEstimate();
    });
  }

  if (customRateInput) {
    customRateInput.addEventListener("input", calculateTaxEstimate);
  }

  function calculateTaxEstimate() {
    const annual = parseNum(annualIncomeInput ? annualIncomeInput.value : 0);
    let rate = 64.1;

    if (jobSelect) {
      if (jobSelect.value === "custom" && customRateInput) {
        rate = Math.min(99, Math.max(0, parseFloat(customRateInput.value) || 0));
      } else {
        rate = jobRates[jobSelect.value] || 64.1;
      }
    }

    // 1. 필요경비 = 총수입 * 경비율
    const expense = annual * (rate / 100);
    // 2. 종합소득금액 = 총수입 - 필요경비
    const incomeAmount = Math.max(0, annual - expense);
    // 3. 인적공제 (본인 기본공제 150만원)
    const personalDeduction = 1500000;
    // 4. 과세표준 = 종합소득금액 - 인적공제
    const taxBase = Math.max(0, incomeAmount - personalDeduction);

    // 5. 기본 산출세액 (2024~2026 누진세율표)
    let calculatedTax = 0;
    if (taxBase <= 14000000) {
      calculatedTax = taxBase * 0.06;
    } else if (taxBase <= 50000000) {
      calculatedTax = 840000 + (taxBase - 14000000) * 0.15;
    } else if (taxBase <= 88000000) {
      calculatedTax = 6240000 + (taxBase - 50000000) * 0.24;
    } else if (taxBase <= 150000000) {
      calculatedTax = 15360000 + (taxBase - 88000000) * 0.35;
    } else {
      calculatedTax = 37060000 + (taxBase - 150000000) * 0.38;
    }

    // 6. 표준세액공제 7만원 적용 (종합소득이 있는 거주자)
    let finalIncomeTax = Math.max(0, calculatedTax - 70000);
    // 지방소득세 10%
    let finalTotalTax = Math.floor(finalIncomeTax * 1.1);

    // 7. 기납부세액 (원천징수된 3.3%)
    const prepaidTax = Math.floor(annual * 0.033);

    // 8. 차액 (기납부세액 - 최종결정세액)
    const diff = prepaidTax - finalTotalTax;

    // UI 업데이트
    document.getElementById("t3AnnualVal").textContent = formatNum(annual) + "원";
    document.getElementById("t3ExpenseVal").textContent = formatNum(expense) + "원 (" + rate + "%)";
    document.getElementById("t3TaxBaseVal").textContent = formatNum(taxBase) + "원";
    document.getElementById("t3PrepaidVal").textContent = formatNum(prepaidTax) + "원";
    document.getElementById("t3FinalTaxVal").textContent = formatNum(finalTotalTax) + "원";

    const badge = document.getElementById("t3ResultBadge");
    const resultTitle = document.getElementById("t3ResultTitle");
    const resultAmt = document.getElementById("t3ResultAmt");
    const resultDesc = document.getElementById("t3ResultDesc");

    if (annual <= 0) {
      badge.className = "result-badge result-badge--neutral";
      badge.textContent = "대기";
      resultTitle.textContent = "연간 수입을 입력해 주세요";
      resultAmt.textContent = "0원";
      resultDesc.textContent = "수입 금액을 입력하면 5월 종소세 환급 예상액을 계산해 드립니다.";
      return;
    }

    if (diff >= 0) {
      badge.className = "result-badge result-badge--positive";
      badge.textContent = "💰 환급 예상";
      resultTitle.textContent = "축하합니다! 5월에 세금을 돌려받을 가능성이 높습니다";
      resultAmt.textContent = "+" + formatNum(diff) + "원";
      resultDesc.textContent = `이미 원천징수로 낸 세금(${formatNum(prepaidTax)}원)이 실제 결정세액(${formatNum(finalTotalTax)}원)보다 많아, 차액인 약 ${formatNum(diff)}원을 국세청으로부터 환급받을 수 있습니다.`;
    } else {
      badge.className = "result-badge result-badge--negative";
      badge.textContent = "⚠️ 추가 납부 예상";
      resultTitle.textContent = "5월에 세금을 추가로 납부할 수 있습니다";
      resultAmt.textContent = "-" + formatNum(Math.abs(diff)) + "원";
      resultDesc.textContent = `연간 수입이 높아 과세표준 구간이 상승했습니다. 신용카드 사용액, 노란우산공제, 주택청약 등 추가 소득공제 항목을 챙기시면 납부세액을 크게 줄일 수 있습니다.`;
    }
  }

  if (annualIncomeInput) {
    annualIncomeInput.addEventListener("input", (e) => {
      const val = parseNum(e.target.value);
      e.target.value = val ? formatNum(val) : "";
      calculateTaxEstimate();
    });
  }

  const annualBtns = document.querySelectorAll("[data-add-annual]");
  annualBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const add = Number(btn.getAttribute("data-add-annual"));
      const curr = parseNum(annualIncomeInput.value);
      annualIncomeInput.value = formatNum(curr + add);
      calculateTaxEstimate();
    });
  });

  const annualReset = document.getElementById("annualReset");
  if (annualReset) {
    annualReset.addEventListener("click", () => {
      annualIncomeInput.value = "";
      calculateTaxEstimate();
    });
  }

  // Initial Calculation with sample defaults
  document.addEventListener("DOMContentLoaded", () => {
    if (grossInput) {
      grossInput.value = "1,000,000";
      calculateGrossToNet();
    }
    if (netInput) {
      netInput.value = "1,000,000";
      calculateNetToGross();
    }
    if (annualIncomeInput) {
      annualIncomeInput.value = "24,000,000";
      calculateTaxEstimate();
    }
  });
})();
