# -*- coding: utf-8 -*-
"""
Salartool Saju Tool Builder
Compiles lunar_test.js, saju_4stick_engine.js, and ilju_career_data.js
into a single, high-performance static HTML app at saju/index.html
"""
import os
import json

BASE_DIR = r"C:\Users\user\Desktop\프로그램\이미지변환기"

# 1. Read libraries
with open(os.path.join(BASE_DIR, "lunar_test.js"), "r", encoding="utf-8") as f:
    lunar_js = f.read()

with open(os.path.join(BASE_DIR, "saju_4stick_engine.js"), "r", encoding="utf-8") as f:
    engine_js = f.read()

with open(os.path.join(BASE_DIR, "js", "ilju_career_data.js"), "r", encoding="utf-8") as f:
    ilju_js = f.read()

with open(os.path.join(BASE_DIR, "qr_path.txt"), "r", encoding="utf-8") as f:
    qr_path = f.read().strip()

with open(os.path.join(BASE_DIR, "seal_b64.txt"), "r", encoding="utf-8") as f:
    seal_b64 = f.read().strip()

# 2. Build full HTML
html_content = f'''<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>직장인 정통 만세력 & 타고난 직업·재물 그릇 계산기 | 샐러리툴 × 사주문답 궁</title>
  <meta name="description" content="내 실수령액과 퇴직금을 계산해 보셨다면, 이제 내 타고난 재물 그릇과 이직 타이밍을 계산해 보세요. 정밀 사주 리포트를 무료로 받아볼수 있습니다.">
  <meta property="og:title" content="직장인 정통 만세력 & 타고난 직업·재물 그릇 계산기 | 샐러리툴 × 사주문답 궁">
  <meta property="og:description" content="내 4기둥 사주 원국표와 60갑자 일주 직장인 심층 리포트, A4 정밀 리포트 무료 인쇄.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://salartool.com/saju/">
  <link rel="icon" href="../favicon.ico" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Noto+Serif+KR:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    :root {{
      --gold: #b38838;
      --gold-dark: #8c6721;
      --gold-light: #fbf5e8;
      --gold-border: #eed8a1;
      --ink: #1f242e;
      --sub: #5a6270;
      --bg: #f8f6f0;
      --card-bg: #ffffff;
      --line: #e8e3d8;
      --serif: 'Noto Serif KR', serif;
      --sans: 'Noto Sans KR', sans-serif;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: var(--sans);
      background-color: var(--bg);
      color: var(--ink);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }}
    header.site-header {{
      background: #ffffff;
      border-bottom: 1px solid var(--line);
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }}
    .header-logo {{
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--ink);
      font-weight: 700;
      font-size: 16.5px;
    }}
    .header-logo span.badge {{
      background: var(--gold-light);
      color: var(--gold-dark);
      border: 1px solid var(--gold-border);
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }}
    .header-nav a {{
      font-size: 13px;
      color: var(--sub);
      text-decoration: none;
      margin-left: 14px;
      font-weight: 500;
    }}
    .header-nav a:hover {{ color: var(--gold); }}

    .container {{
      max-width: 920px;
      margin: 0 auto;
      padding: 24px 16px 80px;
    }}

    .hero-banner {{
      background: linear-gradient(135deg, #242933 0%, #171b22 100%);
      color: #ffffff;
      border-radius: 18px;
      padding: 36px 28px;
      margin-bottom: 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
      border: 1px solid #363d4a;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    }}
    .hero-badge {{
      display: inline-block;
      background: rgba(179, 136, 56, 0.25);
      border: 1px solid var(--gold);
      color: #ffd98a;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 4px 14px;
      border-radius: 999px;
      margin-bottom: 14px;
    }}
    .hero-banner h1 {{
      font-family: var(--serif);
      font-size: 27px;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }}
    .hero-banner p {{
      color: #c4cdd8;
      font-size: 14.5px;
      max-width: 650px;
      margin: 0 auto;
      word-break: keep-all;
      line-height: 1.7;
    }}

    .input-card {{
      background: var(--card-bg);
      border: 1.5px solid var(--line);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }}
    .input-title {{
      font-family: var(--serif);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid var(--line);
      padding-bottom: 14px;
    }}
    .input-title span.sub-note {{
      font-family: var(--sans);
      font-size: 12px;
      color: var(--sub);
      font-weight: normal;
    }}
    .form-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }}
    .form-group {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}
    .form-group label {{
      font-size: 13px;
      font-weight: 600;
      color: var(--sub);
    }}
    .form-group input, .form-group select {{
      padding: 11px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      background: #fafaf8;
      transition: border-color 0.2s, background 0.2s;
    }}
    .form-group input:focus, .form-group select:focus {{
      border-color: var(--gold);
      background: #ffffff;
      outline: none;
    }}
    .form-radio-group {{
      display: flex;
      gap: 12px;
      align-items: center;
      height: 44px;
    }}
    .form-radio-group label {{
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      color: var(--ink);
    }}

    .btn-submit {{
      width: 100%;
      background: linear-gradient(135deg, #b38838 0%, #8c6721 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 16px;
      font-size: 16px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(179, 136, 56, 0.35);
      transition: transform 0.15s, box-shadow 0.15s;
    }}
    .btn-submit:hover {{
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(179, 136, 56, 0.45);
    }}

    /* Result UI */
    .result-section {{
      display: none;
    }}
    .action-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      background: #ffffff;
      border: 1.5px solid var(--gold-border);
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(179, 136, 56, 0.12);
    }}
    .action-bar .info-text {{
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
    }}
    .btn-print {{
      background: linear-gradient(135deg, #242933 0%, #171b22 100%);
      color: #ffffff;
      border: 1px solid #363d4a;
      border-radius: 8px;
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }}
    .btn-print:hover {{
      background: #363d4a;
      transform: translateY(-1px);
    }}

    .wonkook-card {{
      background: #ffffff;
      border: 1.5px solid var(--line);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    }}
    .card-title {{
      font-family: var(--serif);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .wonkook-table {{
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      margin-bottom: 16px;
    }}
    .wonkook-table th {{
      background: #f7f4ee;
      padding: 10px 4px;
      font-size: 13px;
      font-weight: 700;
      border: 1px solid #e5ded0;
      color: var(--ink);
    }}
    .wonkook-table td {{
      padding: 12px 4px;
      border: 1px solid #e5ded0;
      vertical-align: middle;
    }}
    .wonkook-table td.day-col {{
      background: #fcf9f2;
      border-left: 2px solid var(--gold);
      border-right: 2px solid var(--gold);
    }}
    .hanja-large {{
      font-family: var(--serif);
      font-size: 32px;
      font-weight: 700;
      line-height: 1.1;
    }}
    .ten-god-label {{
      font-size: 12px;
      font-weight: 600;
      color: var(--sub);
    }}
    .stage-badge {{
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #2563eb;
      background: #eff6ff;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 4px;
    }}

    /* Ilju Deep Career Analysis Card */
    .ilju-card {{
      background: #ffffff;
      border: 1.5px solid var(--gold-border);
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 6px 20px rgba(179, 136, 56, 0.08);
    }}
    .ilju-header {{
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1.5px solid #f1ece2;
      padding-bottom: 20px;
      margin-bottom: 22px;
    }}
    .ilju-emblem {{
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: linear-gradient(135deg, #b38838 0%, #8c6721 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--serif);
      font-size: 26px;
      font-weight: 700;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(179, 136, 56, 0.3);
    }}
    .ilju-title-wrap h3 {{
      font-family: var(--serif);
      font-size: 22px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }}
    .ilju-title-wrap p {{
      font-size: 13.5px;
      color: var(--gold-dark);
      font-weight: 600;
    }}
    .ilju-section {{
      margin-bottom: 18px;
    }}
    .ilju-section h4 {{
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 6px;
    }}
    .ilju-section p {{
      font-size: 14px;
      color: #4b5563;
      line-height: 1.7;
      word-break: keep-all;
      background: #faf9f6;
      padding: 12px 14px;
      border-radius: 8px;
      border-left: 3px solid var(--gold);
    }}
    .master-advice-box {{
      background: var(--gold-light);
      border: 1px solid var(--gold-border);
      border-radius: 10px;
      padding: 16px;
      margin-top: 22px;
    }}
    .master-advice-box h4 {{
      color: var(--gold-dark);
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 6px;
    }}
    .master-advice-box p {{
      font-size: 14px;
      color: #374151;
      line-height: 1.65;
      font-style: italic;
    }}

    /* Conversion Banner to Oppasaju (Gung) */
    .conversion-banner {{
      background: linear-gradient(135deg, #1c202a 0%, #12151c 100%);
      color: #ffffff;
      border: 1.5px solid var(--gold);
      border-radius: 16px;
      padding: 28px;
      margin-top: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }}
    .banner-text {{
      flex: 1;
      min-width: 260px;
    }}
    .banner-badge {{
      display: inline-block;
      background: rgba(179, 136, 56, 0.25);
      border: 1px solid var(--gold);
      color: #ffd98a;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 4px;
      margin-bottom: 8px;
    }}
    .banner-text h3 {{
      font-family: var(--serif);
      font-size: 21px;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 8px;
      color: #ffffff;
    }}
    .banner-text p {{
      font-size: 13.5px;
      color: #a0aec0;
      line-height: 1.6;
    }}
    .banner-cta {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }}
    .btn-gung {{
      background: linear-gradient(135deg, #b38838 0%, #8c6721 100%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(179, 136, 56, 0.4);
      white-space: nowrap;
      transition: all 0.2s;
    }}
    .btn-gung:hover {{
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(179, 136, 56, 0.55);
    }}

    /* Print Preview Area */
    #print-pages {{
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
      margin-top: 30px;
    }}
    .print-page {{
      background: #ffffff;
      box-shadow: 0 6px 24px rgba(0,0,0,0.08);
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }}
    .print-page svg {{
      display: block;
      width: 100%;
      height: auto;
    }}

    /* Media Print Specifics */
    @media print {{
      body {{ background: #ffffff !important; }}
      header.site-header, .hero-banner, .input-card, .action-bar, .wonkook-card, .ilju-card, .conversion-banner, .noprint {{
        display: none !important;
      }}
      .container {{ max-width: 100% !important; margin: 0 !important; padding: 0 !important; }}
      #print-pages {{ gap: 0 !important; margin: 0 !important; }}
      .print-page {{
        box-shadow: none !important;
        border-radius: 0 !important;
        page-break-after: always !important;
        page-break-inside: avoid !important;
      }}
      .print-page svg {{
        width: 100% !important;
        height: 100vh !important;
      }}
    }}
  </style>
</head>
<body>

  <!-- Site Header -->
  <header class="site-header noprint">
    <a href="../" class="header-logo">
      <span>Salartool × 사주문답 궁</span>
      <span class="badge">공동 기획</span>
    </a>
    <nav class="header-nav">
      <a href="../">계산기 홈</a>
      <a href="../severance/">퇴직금</a>
      <a href="../loan/">대출이자</a>
      <a href="../image-converter/">이미지변환</a>
    </nav>
  </header>

  <div class="container">

    <!-- Hero Banner -->
    <section class="hero-banner noprint">
      <div class="hero-badge">살라툴 × 사주문답 궁 공동 기획</div>
      <h1>직장인 정통 만세력 & 타고난 직업·재물 그릇 계산기</h1>
      <p>내 실수령액과 퇴직금을 계산해 보셨다면, 이제 내 타고난 재물 그릇과 이직 타이밍을 계산해 보세요. 정밀 사주 리포트를 무료로 받아볼수 있습니다.</p>
    </section>

    <!-- Input Form Card -->
    <section class="input-card noprint">
      <div class="input-title">
        <span>나의 출생 정보 입력</span>
        <span class="sub-note">살라툴과 사주문답 궁(宮)이 함께 분석합니다</span>
      </div>
      <form id="saju-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="user-name">이름 (또는 닉네임)</label>
            <input type="text" id="user-name" value="내담자" placeholder="이름을 입력하세요" required>
          </div>
          <div class="form-group">
            <label>성별</label>
            <div class="form-radio-group">
              <label><input type="radio" name="gender" value="male" checked> 남성</label>
              <label><input type="radio" name="gender" value="female"> 여성</label>
            </div>
          </div>
          <div class="form-group">
            <label>양력 / 음력</label>
            <div class="form-radio-group">
              <label><input type="radio" name="cal-type" value="solar" checked> 양력</label>
              <label><input type="radio" name="cal-type" value="lunar"> 음력</label>
              <label><input type="checkbox" id="is-leap"> 윤달</label>
            </div>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group" style="grid-column: span 2;">
            <label>생년월일 (연도 4자리 · 월 · 일)</label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <div style="flex: 1.4; position: relative;">
                <input type="number" id="birth-year" value="1990" min="1900" max="2099" placeholder="연도 4자리 (예: 1990)" required style="width: 100%; padding-right: 28px;" oninput="if(this.value.length>4) this.value=this.value.slice(0,4);">
                <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--sub); pointer-events: none;">년</span>
              </div>
              <div style="flex: 1;">
                <select id="birth-month" required style="width: 100%;"></select>
              </div>
              <div style="flex: 1;">
                <select id="birth-day" required style="width: 100%;"></select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="birth-time">태어난 시간 (모르면 비워두기)</label>
            <input type="time" id="birth-time" value="12:00">
          </div>
          <div class="form-group">
            <label for="birth-city">출생 도시 (진태양시 경도 보정)</label>
            <select id="birth-city"></select>
          </div>
        </div>

        <button type="submit" class="btn-submit">
          나의 직장·재물 사주 원국 풀기
        </button>
      </form>
    </section>

    <!-- Result Area -->
    <main id="result-area" class="result-section">

      <!-- Action Bar -->
      <div class="action-bar noprint">
        <div class="info-text">
          <strong><span id="res-name"></span></strong>님의 정통 만세력 원국과 일주 감명이 완성되었습니다.
        </div>
        <button class="btn-print" id="btn-print">
          A4 정밀 리포트 인쇄 / PDF 저장
        </button>
      </div>

      <!-- 1. Wonkook Card -->
      <div class="wonkook-card noprint">
        <div class="card-title">
          <span>사주 4기둥 원국표 (四柱原局)</span>
          <span style="font-size:12px; font-family:var(--sans); color:var(--sub);">살라툴 × 사주문답 궁 정밀 만세력</span>
        </div>
        <div id="wonkook-table-wrap"></div>
        <div id="ohaeng-bar-wrap" style="margin-top:20px;"></div>
      </div>

      <!-- 2. Ilju Deep Career Analysis Card -->
      <div class="ilju-card noprint" id="ilju-analysis-card">
        <div class="ilju-header">
          <div class="ilju-emblem" id="ilju-emblem-text">甲子</div>
          <div class="ilju-title-wrap">
            <h3 id="ilju-main-title">푸른 쥐 · 자수성가형 기획자</h3>
            <p id="ilju-sub-title">일주(日柱): 甲子 · 정인(正印) · 목욕(沐浴)</p>
          </div>
        </div>

        <div class="ilju-section">
          <h4>[타고난 본성과 천성]</h4>
          <p id="ilju-nature"></p>
        </div>
        <div class="ilju-section">
          <h4>[직장 및 조직 스타일]</h4>
          <p id="ilju-workplace"></p>
        </div>
        <div class="ilju-section">
          <h4>[재물 그릇과 자산 관리]</h4>
          <p id="ilju-money"></p>
        </div>
        <div class="ilju-section">
          <h4>[이직 및 커리어 변곡점]</h4>
          <p id="ilju-career"></p>
        </div>

        <div class="master-advice-box">
          <h4>혜원(彗圓) 선생의 비전 처방</h4>
          <p id="ilju-advice"></p>
        </div>
      </div>

      <!-- 3. Conversion Banner to Jieungak Report (Gung) -->
      <section class="conversion-banner noprint">
        <div class="banner-text">
          <div class="banner-badge">정통 명리학 전문관 · 사주문답 궁(宮)</div>
          <h3>올해 이직해야 할까? 내 진짜 10년 대운이 궁금하다면</h3>
          <p>지금 보신 풀이는 그대의 기본 본성(일주)만을 짚은 것입니다. 인생의 변곡점이 되는 <strong>10년 대운의 물길과 올해의 이직·재물 처방전</strong>은 4기둥 전체의 합충을 정밀하게 보아야 비로소 열립니다.</p>
        </div>
        <div class="banner-cta">
          <a href="https://jieungak-report.pages.dev/" target="_blank" rel="noopener" class="btn-gung">
            사주문답 궁(宮) 50P 처방전 받기 →
          </a>
          <span style="font-size:11px; color:#a0aec0;">모바일 1:1 맞춤형 감명서</span>
        </div>
      </section>

      <!-- 4. High-Res SVG Print Pages Container (A4 3-Page) -->
      <div id="print-pages"></div>

    </main>
  </div>

  <!-- Saju Libraries -->
  <script>{lunar_js}</script>
  <script>{engine_js}</script>
  <script>{ilju_js}</script>

  <!-- Application Logic -->
  <script>
    var CITIES = {{
      '서울': 126.98, '부산': 129.08, '대구': 128.60, '인천': 126.71,
      '광주': 126.85, '대전': 127.38, '울산': 129.31, '수원': 127.03,
      '춘천': 127.73, '강릉': 128.90, '청주': 127.49, '전주': 127.15,
      '포항': 129.37, '제주': 126.53
    }};

    var EL_OF = {{
      '甲':'목','乙':'목','丙':'화','丁':'화','戊':'토','己':'토','庚':'금','辛':'금','壬':'수','癸':'수',
      '子':'수','丑':'토','寅':'목','卯':'목','辰':'토','巳':'화','午':'화','未':'토','申':'금','酉':'금','戌':'토','亥':'수'
    }};

    var THEME = {{
      paper: '#ffffff',
      ink: '#1f242e',
      text: '#222222',
      sub: '#6b7280',
      gold: '#b38838',
      goldLight: '#fbf5e8',
      goldDark: '#8c6721',
      line: '#e5ded0',
      el: {{ '목':'#2e7d32', '화':'#c62828', '토':'#b38838', '금':'#455a64', '수':'#1565c0' }},
      serif: "'Noto Serif KR', serif",
      sans: "'Noto Sans KR', sans-serif"
    }};

    var QR_SVG_PATH = "{qr_path}";
    var SEAL_B64 = "{seal_b64}";

    // Text Wrap Helper for SVG
    function wrapSvgText(text, maxCharsPerLine) {{
      var lines = [];
      var cur = '';
      for (var i = 0; i < text.length; i++) {{
        cur += text[i];
        if (cur.length >= maxCharsPerLine && (text[i] === ' ' || text[i] === '.' || text[i] === ',' || cur.length >= maxCharsPerLine + 3)) {{
          lines.push(cur.trim());
          cur = '';
        }}
      }}
      if (cur.trim()) lines.push(cur.trim());
      return lines;
    }}

    function esc(s) {{
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }}

    // SVG 3-Page Builder
    function buildReportPages(d) {{
      var PW = 794, PH = 1123, MX = 44;
      var T = THEME, out = [];
      var res = d.res;
      var p = res.pillars;
      var col = function (ch) {{ return T.el[EL_OF[ch]] || T.sub; }};

      var txt = function (x, y, s, o) {{
        o = o || {{}};
        return '<text x="' + x + '" y="' + y + '" font-size="' + (o.size || 14) + '" fill="' + (o.fill || T.text) + '" font-family="' + (o.serif ? T.serif : T.sans).replace(/"/g, "'") + '"' +
          (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') + (o.weight ? ' font-weight="' + o.weight + '"' : '') + (o.ls ? ' letter-spacing="' + o.ls + '"' : '') + '>' + esc(s) + '</text>';
      }};
      var rect = function (x, y, w, h, fill, o) {{
        o = o || {{}};
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx || 0) + '" fill="' + fill + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.sw || 1) + '"' : '') + '/>';
      }};
      var svg = function (body, bg) {{
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + PW + '" height="' + PH + '" viewBox="0 0 ' + PW + ' ' + PH + '">' + rect(0, 0, PW, PH, bg || T.paper) + body + '</svg>';
      }};
      var head = function (right) {{
        return txt(MX, 44, 'SALARTOOL × 사주문답 궁 · ' + d.name + '님 직장·재물 사주 리포트', {{ size: 10.5, fill: T.sub, ls: 0.5 }}) +
          txt(PW - MX, 44, right, {{ size: 10.5, fill: T.sub, anchor: 'end' }}) +
          txt(PW / 2, PH - 30, 'SALARTOOL × 사주문답 궁 공동 기획 · 직장인 정밀 만세력', {{ size: 9.5, fill: T.sub, anchor: 'middle' }});
      }};
      var titleBlock = function (y, kicker, title, size) {{
        return txt(MX, y, kicker, {{ size: 11, fill: T.gold, ls: 2, weight: 700 }}) +
          txt(MX, y + 36, title, {{ size: size || 28, serif: true, weight: 700 }}) +
          rect(MX, y + 50, 40, 2.5, T.gold);
      }};

      // 신살 위치 한글화 유틸리티 (hour간 -> 시간, day지 -> 일지 등)
      var posKr = function(pos) {{
        if (!pos) return '';
        return String(pos)
          .replace('hour', '시')
          .replace('day', '일')
          .replace('month', '월')
          .replace('year', '년');
      }};

      // Get Ilju Data
      var iljuHanja = p.day.gan_hanja + p.day.zhi_hanja;
      var ilju = (typeof ILJU_CAREER_MAP !== 'undefined' && ILJU_CAREER_MAP[iljuHanja]) || {{
        title: iljuHanja + ' 일주',
        nature: '자연의 이치를 품고 태어나 자기만의 확고한 신념과 독립심을 지녔습니다.',
        workplace: '자율적인 업무 환경에서 역량을 발휘하며 정직한 실력으로 승부합니다.',
        money: '꾸준한 노력과 실속 있는 자산 관리로 안정된 부를 쌓아갑니다.',
        career: '자신의 전문성을 인정받는 조직으로 점프업할 때 큰 성과를 거둡니다.',
        advice: '자신의 그릇을 믿고 조급해하지 않으면 때가 이르러 큰 결실을 맺을 것이네.'
      }};

      // ==========================================
      // PAGE 1 : Cover (표지) - 완벽한 중앙 정렬
      // ==========================================
      var p1 = head('표지') +
        rect(0, 0, PW, 12, T.gold) +
        rect(MX, 90, PW - MX * 2, PH - 150, '#ffffff', {{ stroke: T.line, rx: 12 }}) +
        rect(MX + 14, 104, PW - MX * 2 - 28, PH - 178, '#faf8f4', {{ stroke: '#eed8a1', rx: 8 }}) +
        // 제목 블록 (완전 중앙 정렬)
        txt(PW / 2, 224, '[ 직장인 정통 사주 리포트 ]', {{ size: 12, fill: T.gold, ls: 2.5, weight: 700, anchor: 'middle' }}) +
        txt(PW / 2, 274, d.name + '님의 직장·재물 사주 리포트', {{ size: 30, serif: true, weight: 700, anchor: 'middle' }}) +
        rect(PW / 2 - 30, 298, 60, 2.5, T.gold) +
        txt(PW / 2, 348, d.birthText + ' (' + d.city + ' 출생 · 진태양시 보정)', {{ size: 15, fill: T.sub, anchor: 'middle' }}) +
        txt(PW / 2, 384, res.yongsin.strength_type + ' · ' + res.yongsin.yongsin_kr + ' 용신 · ' + res.daewoon_info.direction + ' ' + res.daewoon_info.daewoon_num + '대운', {{ size: 14.5, fill: T.goldDark, weight: 700, anchor: 'middle' }}) +
        // 중앙 원형 인장 (사주문답 궁 + 宮 전서체 인장 도장)
        '<circle cx="' + (PW / 2) + '" cy="576" r="82" fill="#fdf6e7" stroke="' + T.gold + '" stroke-width="2"/>' +
        '<circle cx="' + (PW / 2) + '" cy="576" r="74" fill="none" stroke="' + T.gold + '" stroke-width="1" stroke-dasharray="4 3"/>' +
        txt(PW / 2, 540, '사주문답 궁', {{ size: 21, fill: T.goldDark, anchor: 'middle', serif: true, weight: 700, ls: 1.5 }}) +
        '<image href="' + SEAL_B64 + '" x="' + (PW / 2 - 27) + '" y="556" width="54" height="54"/>' +
        txt(PW / 2, 790, 'SALARTOOL × 사주문답 궁', {{ size: 12, fill: T.sub, anchor: 'middle', ls: 2.5, weight: 600 }}) +
        txt(PW / 2, 818, '직장인 맞춤 정밀 사주 분석 리포트', {{ size: 13.5, fill: T.ink, anchor: 'middle', weight: 600 }});

      out.push(svg(p1));

      // ==========================================
      // PAGE 2 : 사주 원국표 및 10년 대운
      // ==========================================
      var p2 = head('1. 사주 원국과 대운') +
        titleBlock(90, '사주 원국', '사주 원국과 십신·12운성');

      var cw = (PW - MX * 2 - 30) / 4;
      var pillarKeys = ['hour', 'day', 'month', 'year'];
      var pillarLabels = ['시주(時)', '일주(日 · 나)', '월주(月)', '년주(年)'];

      pillarKeys.forEach(function (k, i) {{
        var cx = MX + i * (cw + 10);
        var me = (k === 'day');
        var pk = p[k];
        p2 += rect(cx, 166, cw, 224, '#ffffff', {{ rx: 8, stroke: me ? T.gold : T.line, sw: me ? 2 : 1 }}) +
          rect(cx, 166, cw, 26, me ? T.gold : T.ink, {{ rx: 8 }}) + rect(cx, 182, cw, 10, me ? T.gold : T.ink) +
          txt(cx + cw / 2, 184, pillarLabels[i], {{ size: 11, fill: '#fff', anchor: 'middle', weight: 700 }}) +
          txt(cx + cw / 2, 212, pk.ten_god_gan, {{ size: 12, fill: me ? T.goldDark : T.sub, anchor: 'middle', weight: 700 }}) +
          txt(cx + cw / 2, 254, pk.gan_hanja, {{ size: 36, fill: col(pk.gan_hanja), anchor: 'middle', serif: true, weight: 700 }}) +
          txt(cx + cw / 2, 300, pk.zhi_hanja, {{ size: 36, fill: col(pk.zhi_hanja), anchor: 'middle', serif: true, weight: 700 }}) +
          txt(cx + cw / 2, 326, pk.ten_god_zhi, {{ size: 12, fill: T.sub, anchor: 'middle' }}) +
          rect(cx + 8, 336, cw - 16, 20, '#f1f5f9', {{ rx: 4 }}) +
          txt(cx + cw / 2, 350, '[' + pk.life_stage + ']', {{ size: 11, fill: '#2563eb', anchor: 'middle', weight: 700 }}) +
          txt(cx + cw / 2, 376, pk.hidden_stems ? pk.hidden_stems.initial + '·' + (pk.hidden_stems.middle || '') + '·' + pk.hidden_stems.main : '', {{ size: 10, fill: '#9ca3af', anchor: 'middle' }});
      }});

      // 나를 뜻하는 일간 & 오행 밸런스 (텍스트 밖으로 안 밀려나게 3줄 분할 및 폭 제어)
      var bw = (PW - MX * 2 - 16) / 2;
      var dm = res.day_master.stem_hanja;
      var dmKr = res.day_master.stem;
      var dmTitle = res.day_master.symbol.title || (dmKr + '토');
      var dmSymbol = res.day_master.symbol.symbol || '';
      // 텍스트 길이 제한
      if (dmTitle.length > 14) dmTitle = dmTitle.substring(0, 14) + '..';
      if (dmSymbol.length > 18) dmSymbol = dmSymbol.substring(0, 18) + '..';

      p2 += rect(MX, 412, bw, 170, '#ffffff', {{ rx: 8, stroke: T.line }}) +
        txt(MX + 18, 436, '나를 상징하는 일간(日干)', {{ size: 12, fill: T.sub, weight: 600 }}) +
        '<circle cx="' + (MX + 56) + '" cy="502" r="36" fill="' + col(dm) + '"/>' +
        txt(MX + 56, 517, dm, {{ size: 38, fill: '#ffffff', anchor: 'middle', serif: true, weight: 700 }}) +
        txt(MX + 106, 484, dmKr + (EL_OF[dm] || '') + ' (' + dm + ')', {{ size: 18, serif: true, weight: 700 }}) +
        txt(MX + 106, 510, dmTitle, {{ size: 12.5, fill: T.goldDark, weight: 600 }}) +
        txt(MX + 106, 532, dmSymbol, {{ size: 11, fill: T.sub }});

      var bx = MX + bw + 16, ks = ['목', '화', '토', '금', '수'];
      var maxOhaeng = Math.max.apply(null, ks.map(function (k) {{ return res.ohaeng.counts_kr[k]; }}).concat([1]));

      p2 += rect(bx, 412, bw, 170, '#ffffff', {{ rx: 8, stroke: T.line }}) +
        txt(bx + 18, 436, '오행 에너지 밸런스 (' + res.yongsin.strength_type + ')', {{ size: 12, fill: T.sub, weight: 600 }});

      ks.forEach(function (k, i) {{
        var y = 454 + i * 22, tw = bw - 90;
        p2 += txt(bx + 18, y + 11, k, {{ size: 12, fill: T.el[k], weight: 700 }}) +
          rect(bx + 40, y, tw, 12, '#f1ece2', {{ rx: 6 }}) +
          (res.ohaeng.counts_kr[k] ? rect(bx + 40, y, tw * res.ohaeng.counts_kr[k] / maxOhaeng, 12, T.el[k], {{ rx: 6 }}) : '') +
          txt(bx + bw - 18, y + 11, res.ohaeng.counts_kr[k] + '개', {{ size: 11, fill: T.sub, anchor: 'end', weight: 600 }});
      }});

      // 10년 대운
      p2 += titleBlock(616, '대운 흐름', '10년 대운과 인생 변곡점', 21);
      var dw = (PW - MX * 2 - 35) / 8;
      res.daewoon.forEach(function (dwn, i) {{
        var dx = MX + i * (dw + 5);
        p2 += rect(dx, 656, dw, 100, '#ffffff', {{ rx: 6, stroke: T.line }}) +
          txt(dx + dw / 2, 674, dwn.age + '세~', {{ size: 10, fill: T.goldDark, anchor: 'middle', weight: 700 }}) +
          txt(dx + dw / 2, 702, dwn.ganzhi_hanja, {{ size: 16, fill: T.ink, anchor: 'middle', serif: true, weight: 700 }}) +
          txt(dx + dw / 2, 722, dwn.ten_god_gan, {{ size: 10, fill: T.sub, anchor: 'middle' }}) +
          txt(dx + dw / 2, 742, '[' + dwn.life_stage + ']', {{ size: 9, fill: '#2563eb', anchor: 'middle', weight: 600 }});
      }});

      // 신살 요약 바 (한글화 변환 적용)
      p2 += rect(MX, 778, PW - MX * 2, 90, '#ffffff', {{ rx: 8, stroke: T.line }}) +
        txt(MX + 18, 804, '사주에 깃든 핵심 신살(神殺) 및 귀인', {{ size: 12.5, fill: T.goldDark, weight: 700 }}) +
        txt(MX + 18, 832, res.shinsal.slice(0, 6).map(function(s) {{ return '• ' + s.name + '(' + posKr(s.position) + ')'; }}).join('   '), {{ size: 11.5, fill: T.ink }}) +
        txt(MX + 18, 854, '일주 공망: ' + res.gongmang.day_gongmang.name + '   |   용신: ' + res.yongsin.yongsin_kr + ' (' + res.yongsin.strength_type + ')', {{ size: 11, fill: T.sub }});

      out.push(svg(p2));

      // ==========================================
      // PAGE 3 : 나의 일주(日柱) 직장·재물 심층 감명 (폰트 확대 & 가독성 대폭 향상)
      // ==========================================
      var p3 = head('2. 일주 심층 감명') +
        titleBlock(90, '심층 감명', '나의 일주(日柱) 직장·재물 심층 감명');

      // Top Box : Ilju Header Card
      p3 += rect(MX, 160, PW - MX * 2, 70, '#fdf6e7', {{ rx: 8, stroke: '#eed8a1' }}) +
        '<circle cx="' + (MX + 42) + '" cy="195" r="24" fill="' + T.gold + '"/>' +
        txt(MX + 42, 203, iljuHanja, {{ size: 18, fill: '#ffffff', anchor: 'middle', serif: true, weight: 700 }}) +
        txt(MX + 80, 188, ilju.title, {{ size: 18.5, serif: true, weight: 700, fill: T.ink }}) +
        txt(MX + 80, 213, '일주(日柱): ' + iljuHanja + ' (' + p.day.gan + p.day.zhi + ')  ·  ' + (ilju.ten_god || '정관') + '  ·  12운성: ' + (ilju.stage || '건록'), {{ size: 12, fill: T.goldDark, weight: 600 }});

      // 5-Section Paragraphs (시원한 13px 폰트 & 22px 줄간격으로 가독성 극대화)
      var curY = 252;
      var renderIljuSection = function(title, bodyText, maxLines) {{
        var sHtml = txt(MX, curY, '[' + title + ']', {{ size: 14, fill: T.ink, weight: 700 }});
        curY += 19;
        var lines = wrapSvgText(bodyText, 45).slice(0, maxLines || 3);
        rect(MX, curY - 14, PW - MX * 2, lines.length * 22 + 10, '#faf9f6', {{ rx: 6, stroke: '#f1ece2' }});
        lines.forEach(function(l, idx) {{
          sHtml += txt(MX + 16, curY + idx * 22 + 4, l, {{ size: 13, fill: '#374151' }});
        }});
        curY += lines.length * 22 + 18;
        return sHtml;
      }};

      p3 += renderIljuSection('타고난 본성과 천성', ilju.nature, 3);
      p3 += renderIljuSection('직장 및 조직 스타일', ilju.workplace, 3);
      p3 += renderIljuSection('재물 그릇과 자산 관리', ilju.money, 3);
      p3 += renderIljuSection('이직 및 커리어 변곡점', ilju.career, 3);

      // 혜원 선생 비전 처방 박스
      p3 += rect(MX, curY, PW - MX * 2, 74, '#fdf6e7', {{ rx: 8, stroke: '#eed8a1' }}) +
        txt(MX + 18, curY + 26, '혜원(彗圓) 선생의 비전 처방', {{ size: 13, fill: T.goldDark, weight: 700 }}) +
        txt(MX + 18, curY + 52, '"' + (ilju.advice || '그대의 본성을 믿고 나아가시게.') + '"', {{ size: 13, fill: '#1f2937', weight: 500 }});

      curY += 96;

      // Conversion Banner with QR Code to Jieungak Report (Gung)
      var bh = 146;
      p3 += rect(MX, curY, PW - MX * 2, bh, '#1c202a', {{ rx: 10, stroke: T.gold, sw: 1.5 }}) +
        txt(MX + 24, curY + 32, '정통 명리학 전문관 · 사주문답 궁(宮)', {{ size: 11, fill: '#ffd98a', weight: 700, ls: 1 }}) +
        txt(MX + 24, curY + 58, '올해 이직해야 할까? 내 진짜 10년 대운이 궁금하다면', {{ size: 16.5, fill: '#ffffff', serif: true, weight: 700 }}) +
        txt(MX + 24, curY + 84, '지금 보신 풀이는 그대의 기본 본성(일주)만을 짚은 것입니다.', {{ size: 11.5, fill: '#cbd5e1' }}) +
        txt(MX + 24, curY + 104, '인생 10년 대운의 물길과 올해의 재물·이직 타이밍은 4기둥 전체를 보아야 열립니다.', {{ size: 11.5, fill: '#cbd5e1' }}) +
        txt(MX + 24, curY + 126, '사주문답 궁 50페이지 정밀 맞춤 감명서: https://jieungak-report.pages.dev/', {{ size: 11, fill: '#93c5fd', weight: 600 }});

      // Embed Crisp Vector QR Code
      var qrBoxX = PW - MX - 128, qrBoxY = curY + 13;
      p3 += rect(qrBoxX, qrBoxY, 114, 120, '#ffffff', {{ rx: 8, stroke: '#e2e8f0' }}) +
        '<g transform="translate(' + (qrBoxX + 9) + ', ' + (qrBoxY + 8) + ') scale(3.2)">' +
        '<path d="' + QR_SVG_PATH + '" fill="#000000"/>' +
        '</g>' +
        txt(qrBoxX + 57, qrBoxY + 112, '스마트폰 카메라 스캔', {{ size: 9, fill: '#64748b', anchor: 'middle', weight: 600 }});

      out.push(svg(p3));

      return out;
    }}

    // Render Web UI Tables
    function renderWonkookTable(res) {{
      var p = res.pillars;
      var keys = ['hour', 'day', 'month', 'year'];
      var labels = ['시주(時)', '일주(日 · 나)', '월주(月)', '년주(年)'];

      var html = '<table class="wonkook-table"><thead><tr>';
      labels.forEach(function(l) {{ html += '<th>' + l + '</th>'; }});
      html += '</tr></thead><tbody>';

      // 십신 천간
      html += '<tr>';
      keys.forEach(function(k) {{
        var me = (k === 'day');
        html += '<td class="' + (me ? 'day-col' : '') + '"><span class="ten-god-label">' + p[k].ten_god_gan + '</span></td>';
      }});
      html += '</tr>';

      // 천간 한자
      html += '<tr>';
      keys.forEach(function(k) {{
        var me = (k === 'day');
        var c = THEME.el[EL_OF[p[k].gan_hanja]] || '#222';
        html += '<td class="' + (me ? 'day-col' : '') + '"><span class="hanja-large" style="color:' + c + '">' + p[k].gan_hanja + '</span><br><span style="font-size:12px; color:#6b7280;">' + p[k].gan + '</span></td>';
      }});
      html += '</tr>';

      // 지지 한자
      html += '<tr>';
      keys.forEach(function(k) {{
        var me = (k === 'day');
        var c = THEME.el[EL_OF[p[k].zhi_hanja]] || '#222';
        html += '<td class="' + (me ? 'day-col' : '') + '"><span class="hanja-large" style="color:' + c + '">' + p[k].zhi_hanja + '</span><br><span style="font-size:12px; color:#6b7280;">' + p[k].zhi + '</span></td>';
      }});
      html += '</tr>';

      // 십신 지지 + 12운성 + 지장간
      html += '<tr>';
      keys.forEach(function(k) {{
        var me = (k === 'day');
        var hs = p[k].hidden_stems ? p[k].hidden_stems.initial + '·' + (p[k].hidden_stems.middle || '') + '·' + p[k].hidden_stems.main : '';
        html += '<td class="' + (me ? 'day-col' : '') + '">';
        html += '<span class="ten-god-label">' + p[k].ten_god_zhi + '</span><br>';
        html += '<span class="stage-badge">[' + p[k].life_stage + ']</span><br>';
        html += '<span style="font-size:11px; color:#9ca3af;">' + hs + '</span>';
        html += '</td>';
      }});
      html += '</tr>';

      html += '</tbody></table>';
      return html;
    }}

    function renderOhaengBar(res) {{
      var ks = ['목', '화', '토', '금', '수'];
      var max = Math.max.apply(null, ks.map(function (k) {{ return res.ohaeng.counts_kr[k]; }}).concat([1]));
      var html = '<div style="background:#fcfbf9; padding:16px; border-radius:12px; border:1px solid #e5ded0;">';
      html += '<div style="font-size:13px; font-weight:700; margin-bottom:10px; color:#374151;">오행(五行) 에너지 분포 · ' + res.yongsin.strength_type + ' (' + res.yongsin.yongsin_kr + ' 용신)</div>';
      html += '<div style="display:flex; gap:12px; flex-wrap:wrap;">';
      ks.forEach(function(k) {{
        var cnt = res.ohaeng.counts_kr[k] || 0;
        var pct = Math.round(cnt / 8 * 100);
        html += '<div style="flex:1; min-width:80px; background:#fff; padding:8px 10px; border-radius:8px; border:1px solid #e5ded0; text-align:center;">';
        html += '<span style="font-weight:700; color:' + THEME.el[k] + '">' + k + '</span> ';
        html += '<span style="font-size:12px; color:#6b7280;">' + cnt + '개 (' + pct + '%)</span>';
        html += '</div>';
      }});
      html += '</div></div>';
      return html;
    }}

    // App Initialization
    function init() {{
      // Populate Months (1~12)
      var mSelect = document.getElementById('birth-month');
      mSelect.innerHTML = Array.from({{length: 12}}, function(_, i) {{
        var m = i + 1;
        return '<option value="' + m + '"' + (m === 5 ? ' selected' : '') + '>' + m + '월</option>';
      }}).join('');

      // Populate Days (1~31)
      var dSelect = document.getElementById('birth-day');
      function updateDays() {{
        var y = parseInt(document.getElementById('birth-year').value, 10) || 1990;
        var m = parseInt(mSelect.value, 10) || 5;
        var maxDays = new Date(y, m, 0).getDate();
        var curVal = parseInt(dSelect.value, 10) || 15;
        if (curVal > maxDays) curVal = maxDays;
        dSelect.innerHTML = Array.from({{length: maxDays}}, function(_, i) {{
          var d = i + 1;
          return '<option value="' + d + '"' + (d === curVal ? ' selected' : '') + '>' + d + '일</option>';
        }}).join('');
      }}
      updateDays();
      mSelect.addEventListener('change', updateDays);
      document.getElementById('birth-year').addEventListener('input', updateDays);

      var citySelect = document.getElementById('birth-city');
      citySelect.innerHTML = Object.keys(CITIES).map(function(c) {{
        return '<option value="' + c + '"' + (c === '서울' ? ' selected' : '') + '>' + c + ' (경도 ' + CITIES[c] + '°)</option>';
      }}).join('');

      var form = document.getElementById('saju-form');
      form.addEventListener('submit', function(e) {{
        e.preventDefault();

        var name = document.getElementById('user-name').value.trim() || '내담자';
        var gender = document.querySelector('input[name="gender"]:checked').value;
        var calType = document.querySelector('input[name="cal-type"]:checked').value;
        var isLeap = document.getElementById('is-leap').checked;

        var yInput = document.getElementById('birth-year');
        var y = parseInt(yInput.value, 10);
        if (isNaN(y) || y < 1900 || y > 2099) {{
          alert('연도를 4자리(1900~2099) 숫자로 정확히 입력해 주세요.');
          yInput.focus();
          return;
        }}
        var m = String(document.getElementById('birth-month').value).padStart(2, '0');
        var d = String(document.getElementById('birth-day').value).padStart(2, '0');
        var birthDate = y + '-' + m + '-' + d;

        var birthTime = document.getElementById('birth-time').value;
        var cityName = document.getElementById('birth-city').value;

        // Lunar Conversion if needed
        var calcSolarDate = birthDate;
        if (calType === 'lunar') {{
          var lParts = birthDate.split('-').map(Number);
          var lunarObj = Lunar.fromYmd(lParts[0], isLeap ? -lParts[1] : lParts[1], lParts[2]);
          var solarObj = lunarObj.getSolar();
          var sM = String(solarObj.getMonth()).padStart(2, '0');
          var sD = String(solarObj.getDay()).padStart(2, '0');
          calcSolarDate = solarObj.getYear() + '-' + sM + '-' + sD;
        }}

        try {{
          var res = Saju4Stick.calculateSaju4Stick(calcSolarDate, birthTime, gender, cityName);

          // Populate Result
          document.getElementById('res-name').textContent = name;
          document.getElementById('wonkook-table-wrap').innerHTML = renderWonkookTable(res);
          document.getElementById('ohaeng-bar-wrap').innerHTML = renderOhaengBar(res);

          // Populate Ilju Deep Card
          var iljuHanja = res.pillars.day.gan_hanja + res.pillars.day.zhi_hanja;
          var ilju = (typeof ILJU_CAREER_MAP !== 'undefined' && ILJU_CAREER_MAP[iljuHanja]) || {{
            title: iljuHanja + ' 일주',
            nature: '자연의 이치를 품고 태어나 자기만의 확고한 신념과 독립심을 지녔습니다.',
            workplace: '자율적인 업무 환경에서 역량을 발휘하며 정직한 실력으로 승부합니다.',
            money: '꾸준한 노력과 실속 있는 자산 관리로 안정된 부를 쌓아갑니다.',
            career: '자신의 전문성을 인정받는 조직으로 점프업할 때 큰 성과를 거둡니다.',
            advice: '자신의 그릇을 믿고 조급해하지 않으면 때가 이르러 큰 결실을 맺을 것이네.'
          }};

          document.getElementById('ilju-emblem-text').textContent = iljuHanja;
          document.getElementById('ilju-main-title').textContent = ilju.title;
          document.getElementById('ilju-sub-title').textContent = '일주(日柱): ' + iljuHanja + '  ·  ' + (ilju.ten_god || '정관') + '  ·  12운성: ' + (ilju.stage || '건록');
          document.getElementById('ilju-nature').textContent = ilju.nature;
          document.getElementById('ilju-workplace').textContent = ilju.workplace;
          document.getElementById('ilju-money').textContent = ilju.money;
          document.getElementById('ilju-career').textContent = ilju.career;
          document.getElementById('ilju-advice').textContent = '"' + ilju.advice + '"';

          // Build SVG Print Pages
          var svgPages = buildReportPages({{
            name: name,
            birthText: birthDate + (birthTime ? ' ' + birthTime : ' 시간미정') + (calType === 'lunar' ? ' (음력' + (isLeap ? ' 윤달' : '') + ')' : ' (양력)'),
            city: cityName,
            res: res
          }});

          var printContainer = document.getElementById('print-pages');
          printContainer.innerHTML = svgPages.map(function(s, idx) {{
            return '<div class="print-page" id="page-' + (idx + 1) + '">' + s + '</div>';
          }}).join('');

          // Show Results
          document.getElementById('result-area').style.display = 'block';
          document.getElementById('result-area').scrollIntoView({{ behavior: 'smooth' }});

        }} catch(err) {{
          console.error(err);
          alert('사주 계산 중 오류가 발생했습니다: ' + err.message);
        }}
      }});

      // Print Button Handler
      document.getElementById('btn-print').addEventListener('click', function() {{
        window.print();
      }});
    }}

    if (document.readyState === 'loading') {{
      document.addEventListener('DOMContentLoaded', init);
    }} else {{
      init();
    }}
  </script>
</body>
</html>
'''

# 3. Write target file
target_path = os.path.join(BASE_DIR, "saju", "index.html")
with open(target_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully generated {target_path} (File size: {len(html_content)} bytes)")
