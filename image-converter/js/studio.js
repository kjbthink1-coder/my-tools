/**
 * Salartool Studio (스마트 이미지 최적화 & EXIF 스튜디오)
 * 100% Client-side Browser Engine (No server, Zero upload)
 */

(function () {
  'use strict';

  function byId(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function(c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function kb(bytes) { return Math.max(1, Math.round(bytes / 1024)).toLocaleString('ko-KR') + ' KB'; }
  function safeName(name) { return String(name || 'image').replace(/[\\/:*?"<>|]/g, '_'); }
  function baseName(name) { return safeName(name).replace(/\.[^.]+$/, ''); }
  function extFor(type) { return type === 'image/jpeg' ? 'jpg' : (type === 'image/png' ? 'png' : 'webp'); }

  // ──────────────────────────────────────────
  // 1. 카메라 프로필 정의 (2026 최신 기종 포함)
  // ──────────────────────────────────────────
  var CAMERA_PROFILES = {
    samsung_s25: { make: 'samsung', model: 'SM-S938N', sw: 'S938NKSU1AXL1', fn: [17, 10], fl: [63, 10], fl35: 24, iso: 50, exp: [1, 60] },
    samsung_s24: { make: 'samsung', model: 'SM-S928N', sw: 'S928NKSU2AXK1', fn: [17, 10], fl: [66, 10], fl35: 24, iso: 50, exp: [1, 60] },
    samsung_s23: { make: 'samsung', model: 'SM-S911N', sw: 'S911NKSU4CXF1', fn: [17, 10], fl: [66, 10], fl35: 24, iso: 64, exp: [1, 50] },
    samsung_a55: { make: 'samsung', model: 'SM-A556N', sw: 'A556NKSU3AXF1', fn: [18, 10], fl: [55, 10], fl35: 26, iso: 100, exp: [1, 30] },
    iphone16pro: { make: 'Apple', model: 'iPhone 16 Pro', sw: '18.1.1', fn: [178, 100], fl: [6765, 1000], fl35: 24, iso: 50, exp: [1, 120] },
    iphone15pro: { make: 'Apple', model: 'iPhone 15 Pro', sw: '17.5.1', fn: [178, 100], fl: [6765, 1000], fl35: 24, iso: 50, exp: [1, 120] },
    iphone15:    { make: 'Apple', model: 'iPhone 15', sw: '17.5.1', fn: [17, 10], fl: [6765, 1000], fl35: 26, iso: 64, exp: [1, 100] },
    iphone14:    { make: 'Apple', model: 'iPhone 14', sw: '16.7.2', fn: [17, 10], fl: [5700, 1000], fl35: 26, iso: 80, exp: [1, 80] },
    sony_a7m4:   { make: 'SONY', model: 'ILCE-7M4', sw: 'Ver. 3.01', fn: [28, 10], fl: [350, 10], fl35: 35, iso: 100, exp: [1, 160] }
  };

  // ──────────────────────────────────────────
  // 2. 국내외 인기 명소 GPS 프리셋
  // ──────────────────────────────────────────
  var GPS_PRESETS = {
    seoul_gangnam:    { name: '서울 강남역 / 테헤란로', lat: 37.498095, lng: 127.027610, alt: 38 },
    seoul_hongdae:    { name: '서울 홍대입구 / 연남동', lat: 37.556850, lng: 126.924200, alt: 25 },
    seoul_seongsu:    { name: '서울 성수동 / 서울숲', lat: 37.544520, lng: 127.044180, alt: 20 },
    seoul_myeongdong: { name: '서울 명동 / 을지로', lat: 37.563600, lng: 126.983900, alt: 35 },
    seoul_jamsil:     { name: '서울 잠실 롯데월드타워', lat: 37.512600, lng: 127.102500, alt: 22 },
    seoul_yeouido:    { name: '서울 여의도 더현대 / 한강공원', lat: 37.528400, lng: 126.932800, alt: 15 },
    seoul_jongno:     { name: '서울 종로 / 광화문 / 인사동', lat: 37.572400, lng: 126.987500, alt: 40 },
    seoul_itaewon:    { name: '서울 이태원 / 한남동', lat: 37.534500, lng: 126.994200, alt: 60 },
    gyeonggi_pangyo:  { name: '경기 판교테크노밸리', lat: 37.400500, lng: 127.107200, alt: 50 },
    gyeonggi_suwon:   { name: '경기 수원 행궁동 / 광교', lat: 37.285200, lng: 127.015800, alt: 45 },
    gyeonggi_ilsan:   { name: '경기 일산 호수공원', lat: 37.658200, lng: 126.764500, alt: 20 },
    incheon_songdo:   { name: '인천 송도 센트럴파크', lat: 37.392500, lng: 126.639400, alt: 10 },
    busan_haeundae:   { name: '부산 해운대 해수욕장', lat: 35.158700, lng: 129.160400, alt: 5 },
    busan_gwanganri:  { name: '부산 광안리 해변', lat: 35.153200, lng: 129.118600, alt: 6 },
    busan_seomyeon:   { name: '부산 서면 / 전포 카페거리', lat: 35.157800, lng: 129.060100, alt: 18 },
    daegu_dongseong:  { name: '대구 동성로 / 수성못', lat: 35.871400, lng: 128.598200, alt: 45 },
    gyeongju_hwangni: { name: '경북 경주 황리단길 / 첨성대', lat: 35.835500, lng: 129.210400, alt: 40 },
    pohang_space:     { name: '경북 포항 영일대 / 스페이스워크', lat: 36.055800, lng: 129.382000, alt: 25 },
    gangwon_gangneung:{ name: '강원 강릉 안목해변 카페거리', lat: 37.771800, lng: 128.948500, alt: 8 },
    gangwon_sokcho:   { name: '강원 속초 해변 / 중앙시장', lat: 38.190600, lng: 128.603300, alt: 10 },
    gangwon_yangyang: { name: '강원 양양 서피비치', lat: 38.026400, lng: 128.717200, alt: 7 },
    daejeon_dunsan:   { name: '대전 둔산동 / 성심당', lat: 36.350400, lng: 127.384500, alt: 50 },
    jeonju_hanok:     { name: '전북 전주 한옥마을', lat: 35.814700, lng: 127.152600, alt: 55 },
    yeosu_ocean:      { name: '전남 여수 해양공원 / 오동도', lat: 34.743100, lng: 127.766300, alt: 12 },
    jeju_aewol:       { name: '제주 애월 한담해변 (서쪽)', lat: 33.462300, lng: 126.310500, alt: 15 },
    jeju_seongsan:    { name: '제주 성산일출봉 / 섭지코지', lat: 33.458600, lng: 126.942400, alt: 30 },
    jeju_jungmun:     { name: '제주 서귀포 중문관광단지', lat: 33.248300, lng: 126.411600, alt: 45 },
    jeju_hyeopjae:    { name: '제주 협재 / 금능 해변', lat: 33.393800, lng: 126.239600, alt: 10 },
    japan_tokyo:      { name: '일본 도쿄 (시부야 스크램블)', lat: 35.659500, lng: 139.700500, alt: 32 },
    japan_osaka:      { name: '일본 오사카 (도톤보리)', lat: 34.668700, lng: 135.501300, alt: 12 },
    vietnam_danang:   { name: '베트남 다낭 (미케비치)', lat: 16.059400, lng: 108.246800, alt: 8 },
    thailand_bangkok: { name: '태국 방콕 (시암 / 아속)', lat: 13.746600, lng: 100.534800, alt: 10 },
    france_paris:     { name: '프랑스 파리 (에펠탑 / 루브르)', lat: 48.858400, lng: 2.294500, alt: 35 },
    usa_ny:           { name: '미국 뉴욕 (타임스퀘어)', lat: 40.758000, lng: -73.985500, alt: 20 }
  };

  var activeGpsLocation = GPS_PRESETS['seoul_gangnam'];
  var activeDatePreset = 'today';

  // ──────────────────────────────────────────
  // 3. 탭 스위칭 로직
  // ──────────────────────────────────────────
  window.switchStudioTab = function(tabName) {
    var tabs = document.querySelectorAll('.studio-tab-btn');
    var panels = document.querySelectorAll('.studio-panel');
    tabs.forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === tabName);
    });
    panels.forEach(function(p) {
      p.classList.toggle('active', p.id === 'panel-' + tabName);
    });
  };

  // ──────────────────────────────────────────
  // 4. TAB 1: 스마트 EXIF & 위치 스튜디오
  // ──────────────────────────────────────────
  var tab1Files = [];
  var tab1Results = [];

  function isHeic(f) {
    return /\.(heic|heif)$/i.test(f.name || '') || /image\/(heic|heif)/i.test(f.type || '');
  }

  function loadImage(blob) {
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function() { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('이미지를 디코딩하지 못했습니다.')); };
      img.src = url;
    });
  }

  async function browserReadableBlob(file, quality) {
    if (!isHeic(file)) return file;
    if (typeof heic2any !== 'function') throw new Error('HEIC 변환 모듈을 불러오지 못했습니다.');
    var out = await heic2any({ blob: file, toType: 'image/jpeg', quality: quality });
    return Array.isArray(out) ? out[0] : out;
  }

  function formatExifDateTime(d) {
    var pad = function(n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + ':' + pad(d.getMonth() + 1) + ':' + pad(d.getDate()) + ' ' +
           pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function applyGpsToExifObj(exifObj, gpsCoords, dateObj) {
    if (!gpsCoords || typeof piexif === 'undefined' || !piexif.GPSIFD) return;
    var G = piexif.GPSIFD;
    var rawLat = Number(gpsCoords.lat) || 0;
    var rawLng = Number(gpsCoords.lng) || 0;
    var lat = Math.abs(rawLat);
    var lng = Math.abs(rawLng);
    var alt = Math.max(0, Number(gpsCoords.alt) || 20);
    var latRef = rawLat >= 0 ? 'N' : 'S';
    var lngRef = rawLng >= 0 ? 'E' : 'W';

    if (!exifObj['GPS']) exifObj['GPS'] = {};
    exifObj['GPS'][G.GPSVersionID] = [2, 3, 0, 0];
    exifObj['GPS'][G.GPSLatitudeRef] = latRef;
    exifObj['GPS'][G.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
    exifObj['GPS'][G.GPSLongitudeRef] = lngRef;
    exifObj['GPS'][G.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);
    exifObj['GPS'][G.GPSAltitudeRef] = 0;
    exifObj['GPS'][G.GPSAltitude] = [Math.round(alt * 10), 10];

    var d = (dateObj instanceof Date && !isNaN(dateObj.getTime())) ? dateObj : new Date();
    exifObj['GPS'][G.GPSTimeStamp] = [
      [d.getUTCHours(), 1],
      [d.getUTCMinutes(), 1],
      [d.getUTCSeconds(), 1]
    ];
    var pad = function(n) { return String(n).padStart(2, '0'); };
    exifObj['GPS'][G.GPSDateStamp] = d.getUTCFullYear() + ':' + pad(d.getUTCMonth() + 1) + ':' + pad(d.getUTCDate());
    exifObj['GPS'][G.GPSMapDatum] = 'WGS-84';
  }

  function injectExifJpeg(jpegBlob, cameraKey, gpsCoords, dateObj) {
    return new Promise(function(resolve) {
      if (typeof piexif === 'undefined') { resolve(jpegBlob); return; }
      var cam = CAMERA_PROFILES[cameraKey] || CAMERA_PROFILES['samsung_s24'];
      var d = (dateObj instanceof Date && !isNaN(dateObj.getTime())) ? dateObj : new Date();
      var dateStr = formatExifDateTime(d);
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var dataUrl = e.target.result;
          var exifObj = { '0th':{}, 'Exif':{}, 'GPS':{}, 'Interop':{}, '1st':{} };
          var I = piexif.ImageIFD, E = piexif.ExifIFD;
          exifObj['0th'][I.Make]             = cam.make;
          exifObj['0th'][I.Model]            = cam.model;
          exifObj['0th'][I.Software]         = cam.sw;
          exifObj['0th'][I.DateTime]         = dateStr;
          exifObj['0th'][I.Orientation]      = 1;
          exifObj['0th'][I.XResolution]      = [72,1];
          exifObj['0th'][I.YResolution]      = [72,1];
          exifObj['0th'][I.ResolutionUnit]   = 2;
          exifObj['0th'][I.YCbCrPositioning] = 1;
          exifObj['Exif'][E.ExposureTime]      = cam.exp;
          exifObj['Exif'][E.FNumber]           = cam.fn;
          exifObj['Exif'][E.ISOSpeedRatings]   = cam.iso;
          exifObj['Exif'][E.DateTimeOriginal]  = dateStr;
          exifObj['Exif'][E.DateTimeDigitized] = dateStr;
          exifObj['Exif'][E.ApertureValue]     = cam.fn;
          exifObj['Exif'][E.Flash]             = 0;
          exifObj['Exif'][E.FocalLength]       = cam.fl;
          if (cam.fl35) exifObj['Exif'][E.FocalLengthIn35mmFilm] = cam.fl35;
          exifObj['Exif'][E.ColorSpace]        = 1;
          exifObj['Exif'][E.SceneCaptureType]  = 0;
          exifObj['Exif'][E.ExifVersion]       = '0232';
          exifObj['Exif'][E.FlashpixVersion]   = '0100';
          exifObj['Exif'][E.ExposureMode]      = 0;
          exifObj['Exif'][E.WhiteBalance]      = 0;
          if (gpsCoords) applyGpsToExifObj(exifObj, gpsCoords, d);
          var exifBytes = piexif.dump(exifObj);
          var newDataUrl = piexif.insert(exifBytes, dataUrl);
          var b64 = newDataUrl.split(',')[1];
          var bin = atob(b64);
          var arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          resolve(new Blob([arr], { type: 'image/jpeg' }));
        } catch(err) {
          console.error('EXIF inject error:', err);
          resolve(jpegBlob);
        }
      };
      reader.readAsDataURL(jpegBlob);
    });
  }

  // PNG eXIf chunk insertion helper
  var CRC_TABLE = (function() {
    var c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[n] = c;
    }
    return table;
  })();

  function pngCrc32(buf) {
    var crc = 0xFFFFFFFF;
    for (var i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function injectExifPng(pngBlob, cameraKey, gpsCoords, dateObj) {
    return new Promise(function(resolve) {
      if (typeof piexif === 'undefined') { resolve(pngBlob); return; }
      var cam = CAMERA_PROFILES[cameraKey] || CAMERA_PROFILES['samsung_s24'];
      var d = (dateObj instanceof Date && !isNaN(dateObj.getTime())) ? dateObj : new Date();
      var dateStr = formatExifDateTime(d);
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var buf = new Uint8Array(e.target.result);
          var exifObj = { '0th':{}, 'Exif':{}, 'GPS':{}, 'Interop':{}, '1st':{} };
          var I = piexif.ImageIFD, E = piexif.ExifIFD;
          exifObj['0th'][I.Make] = cam.make;
          exifObj['0th'][I.Model] = cam.model;
          exifObj['0th'][I.Software] = cam.sw;
          exifObj['0th'][I.DateTime] = dateStr;
          exifObj['Exif'][E.DateTimeOriginal] = dateStr;
          exifObj['Exif'][E.DateTimeDigitized] = dateStr;
          if (gpsCoords) applyGpsToExifObj(exifObj, gpsCoords, d);
          var exifDump = piexif.dump(exifObj);
          var exifBytes = new Uint8Array(exifDump.length);
          for (var i = 0; i < exifDump.length; i++) exifBytes[i] = exifDump.charCodeAt(i) & 0xFF;
          var typeBytes = new Uint8Array([0x65, 0x58, 0x49, 0x66]); // 'eXIf'
          var crcBuf = new Uint8Array(4 + exifBytes.length);
          crcBuf.set(typeBytes, 0); crcBuf.set(exifBytes, 4);
          var crc = pngCrc32(crcBuf);
          var dlen = exifBytes.length;
          var chunk = new Uint8Array(4 + 4 + dlen + 4);
          chunk[0]=(dlen>>24)&0xFF; chunk[1]=(dlen>>16)&0xFF; chunk[2]=(dlen>>8)&0xFF; chunk[3]=dlen&0xFF;
          chunk.set(typeBytes, 4); chunk.set(exifBytes, 8);
          chunk[8+dlen]=(crc>>24)&0xFF; chunk[8+dlen+1]=(crc>>16)&0xFF; chunk[8+dlen+2]=(crc>>8)&0xFF; chunk[8+dlen+3]=crc&0xFF;
          // Insert right after PNG signature (byte 8)
          var out = new Uint8Array(buf.length + chunk.length);
          out.set(buf.subarray(0, 8), 0);
          out.set(chunk, 8);
          out.set(buf.subarray(8), 8 + chunk.length);
          resolve(new Blob([out], { type: 'image/png' }));
        } catch(err) {
          console.error('PNG EXIF inject error:', err);
          resolve(pngBlob);
        }
      };
      reader.readAsArrayBuffer(pngBlob);
    });
  }

  // Calculate Date based on Preset
  function calculateBaseDate(preset) {
    var now = new Date();
    switch (preset) {
      case '1week':  return new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      case '1month': return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), now.getHours(), now.getMinutes());
      case '3month': return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), now.getHours(), now.getMinutes());
      case '6month': return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), now.getHours(), now.getMinutes());
      case '1year':  return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
      case 'random':
        var daysAgo = 10 + Math.floor(Math.random() * 180);
        var r = new Date(now.getTime() - daysAgo * 24 * 3600 * 1000);
        r.setHours(9 + Math.floor(Math.random() * 11));
        r.setMinutes(Math.floor(Math.random() * 60));
        return r;
      case 'custom':
        var val = byId('optCustomDatetime') ? byId('optCustomDatetime').value : '';
        return val ? new Date(val) : now;
      default: return now;
    }
  }

  // Render file list
  function renderTab1List() {
    var container = byId('tab1FileList');
    if (!container) return;
    if (tab1Files.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:#94a3b8; font-size:14px;">선택된 파일이 없습니다. 위 박스에 이미지를 끌어놓으세요.</div>';
      return;
    }
    container.innerHTML = '';
    tab1Files.forEach(function(file, i) {
      var item = document.createElement('div');
      item.className = 'studio-file-item';
      var res = tab1Results[i];

      var thumb = document.createElement('img');
      thumb.className = 'studio-file-thumb';
      thumb.src = res ? res.url : (file._preview || '');
      if (!thumb.src) {
        var reader = new FileReader();
        reader.onload = function(e) { thumb.src = e.target.result; file._preview = e.target.result; };
        reader.readAsDataURL(file);
      }

      var info = document.createElement('div');
      info.className = 'studio-file-info';
      info.appendChild(thumb);

      var meta = document.createElement('div');
      meta.className = 'studio-file-meta';
      meta.innerHTML = '<div class="studio-file-name">' + esc(file.name) + '</div>' +
        '<div class="studio-file-sub">' +
          '<span>원본: ' + kb(file.size) + '</span>' +
          (res ? '<span class="studio-badge-tag studio-badge-tag--saving">변환: ' + kb(res.blob.size) + '</span>' : '') +
          (res ? '<span class="studio-badge-tag studio-badge-tag--ok">' + esc(res.desc) + '</span>' : '<span class="studio-badge-tag studio-badge-tag--wait">대기 중</span>') +
        '</div>';
      info.appendChild(meta);
      item.appendChild(info);

      var act = document.createElement('div');
      act.style.display = 'flex';
      act.style.alignItems = 'center';
      act.style.gap = '8px';

      if (res) {
        var dl = document.createElement('a');
        dl.className = 'btn-studio btn-studio--accent';
        dl.style.cssText = 'padding:6px 14px; font-size:13px; text-decoration:none;';
        dl.href = res.url;
        dl.download = res.name;
        dl.textContent = '다운로드';
        act.appendChild(dl);
      }
      item.appendChild(act);
      container.appendChild(item);
    });
  }

  // Convert one file
  async function convertOne(file, type, quality, maxW, maxH, fakeExif, cameraKey, gpsCoords, dateObj) {
    var source = await browserReadableBlob(file, quality);
    var img = await loadImage(source);
    var scale = 1;
    if (maxW > 0 && img.naturalWidth > maxW) scale = Math.min(scale, maxW / img.naturalWidth);
    if (maxH > 0 && img.naturalHeight > maxH) scale = Math.min(scale, maxH / img.naturalHeight);

    var canvas = document.createElement('canvas');
    canvas.width  = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    var ctx = canvas.getContext('2d');
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var blob = await new Promise(function(resolve) { canvas.toBlob(resolve, type, quality); });
    if (!blob) throw new Error('변환 실패');

    var d = (dateObj instanceof Date && !isNaN(dateObj.getTime())) ? dateObj : new Date();
    var pad = function(n) { return String(n).padStart(2, '0'); };
    var dateSummary = d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());

    var tagDesc = '원본 메타 세탁 완료';
    if (fakeExif) {
      var cam = CAMERA_PROFILES[cameraKey] || CAMERA_PROFILES['samsung_s24'];
      if (type === 'image/jpeg') {
        blob = await injectExifJpeg(blob, cameraKey, gpsCoords, d);
        tagDesc = '✓ ' + cam.model + ' · ' + dateSummary + (gpsCoords ? ' · GPS(' + gpsCoords.name + ')' : '');
      } else if (type === 'image/png') {
        blob = await injectExifPng(blob, cameraKey, gpsCoords, d);
        tagDesc = '✓ ' + cam.model + ' · ' + dateSummary + (gpsCoords ? ' · GPS(' + gpsCoords.name + ')' : '');
      } else {
        tagDesc = '✓ WebP 메타데이터 세탁';
      }
    }

    return {
      blob: blob,
      name: baseName(file.name) + '.' + extFor(type),
      url: URL.createObjectURL(blob),
      desc: tagDesc
    };
  }

  // Start conversion
  async function runTab1Conversion() {
    if (!tab1Files.length) {
      alert('먼저 이미지를 추가해 주세요.');
      return false;
    }
    var status = byId('tab1Status');
    var btnStart = byId('btnTab1Start');
    var btnZip = byId('btnTab1Zip');
    if (btnStart) btnStart.disabled = true;
    if (btnZip) btnZip.disabled = true;

    tab1Results.forEach(function(r) { if (r && r.url) URL.revokeObjectURL(r.url); });
    tab1Results = [];

    var type = byId('optFormat').value;
    var quality = Number(byId('optQuality').value) / 100;
    var maxW = Math.max(0, Number(byId('optMaxWidth').value) || 0);
    var maxH = Math.max(0, Number(byId('optMaxHeight').value) || 0);
    var fakeExif = byId('optFakeExif').checked;
    var cameraKey = byId('optCameraModel').value;
    var insertGps = byId('optInsertGps').checked;
    var baseLocation = insertGps ? activeGpsLocation : null;
    var baseDate = calculateBaseDate(activeDatePreset);

    status.style.color = '#4f46e5';
    status.textContent = '🚀 고속 픽셀 재렌더링 및 EXIF/GPS 주입 중... (0/' + tab1Files.length + ')';

    for (var i = 0; i < tab1Files.length; i++) {
      status.textContent = '🚀 변환 중 (' + (i + 1) + '/' + tab1Files.length + '): ' + tab1Files[i].name;

      var photoGps = null;
      if (baseLocation) {
        var jLat = (Math.random() - 0.5) * 0.0007; // ±35~40m
        var jLng = (Math.random() - 0.5) * 0.0007;
        var jAlt = (Math.random() - 0.5) * 8;
        photoGps = {
          lat: baseLocation.lat + jLat,
          lng: baseLocation.lng + jLng,
          alt: Math.max(1, (baseLocation.alt || 20) + jAlt),
          name: baseLocation.name
        };
      }

      var intervalSec = (i * 90) + Math.floor((Math.random() - 0.5) * 30);
      if (intervalSec < 0) intervalSec = 0;
      var photoDate = new Date(baseDate.getTime() + (intervalSec * 1000));

      try {
        tab1Results[i] = await convertOne(tab1Files[i], type, quality, maxW, maxH, fakeExif, cameraKey, photoGps, photoDate);
      } catch (err) {
        console.error(err);
        tab1Results[i] = null;
      }
      renderTab1List();
    }

    status.style.color = '#10b981';
    status.textContent = '✨ 모든 사진 변환 완료! 아래에서 개별 다운로드하거나 ZIP으로 한 번에 받으세요.';
    if (btnStart) btnStart.disabled = false;
    if (btnZip) btnZip.disabled = false;
    return true;
  }

  // ZIP download for Tab 1
  async function downloadTab1Zip() {
    if (!tab1Results.length) {
      var ok = await runTab1Conversion();
      if (!ok) return;
    }
    var btn = byId('btnTab1Zip');
    if (btn) { btn.disabled = true; btn.textContent = '📦 ZIP 압축 생성 중...'; }
    try {
      var zip = new JSZip();
      tab1Results.forEach(function(res, idx) {
        if (res && res.blob) {
          zip.file(res.name, res.blob);
        }
      });
      var zipBlob = await zip.generateAsync({ type: 'blob' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = 'salartool-studio-exif-' + new Date().toISOString().slice(0, 10) + '.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert('ZIP 생성 중 오류가 발생했습니다: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '📦 전체 변환 + ZIP 다운로드'; }
    }
  }

  // ──────────────────────────────────────────
  // 5. GPS 검색 (OpenStreetMap Nominatim)
  // ──────────────────────────────────────────
  window.doGpsSearch = async function() {
    var input = byId('gpsSearchInput');
    var btn = byId('btnGpsSearch');
    var box = byId('gpsResultsBox');
    if (!input || !box) return;
    var query = input.value.trim();
    if (!query) { alert('검색할 장소명을 입력해 주세요 (예: 영국 대영박물관, 성수동 카페)'); return; }

    if (btn) { btn.disabled = true; btn.textContent = '검색 중...'; }
    box.style.display = 'block';
    box.innerHTML = '<div style="padding:14px; text-align:center; color:#6b21a8; font-size:13px;">🌐 전 세계 지리 데이터에서 검색 중...</div>';

    try {
      var url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&accept-language=ko,en&limit=6';
      var res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      var data = await res.json();
      if (!data || !data.length) {
        box.innerHTML = '<div style="padding:14px; text-align:center; color:#ef4444; font-size:13px;">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</div>';
        return;
      }
      box.innerHTML = data.map(function(item, idx) {
        var parts = (item.display_name || '').split(', ');
        var title = parts[0] || query;
        var sub = parts.slice(1, 4).join(', ');
        return '<div class="gps-result-item" data-idx="' + idx + '" data-lat="' + item.lat + '" data-lng="' + item.lon + '" data-title="' + esc(title) + '">' +
          '<div style="font-weight:700; color:#4f46e5; font-size:13px;">📍 ' + esc(title) + '</div>' +
          '<div style="font-size:11px; color:#64748b; margin-top:2px;">' + esc(sub) + ' (' + Number(item.lat).toFixed(4) + ', ' + Number(item.lon).toFixed(4) + ')</div>' +
        '</div>';
      }).join('');

      box.querySelectorAll('.gps-result-item').forEach(function(el) {
        el.addEventListener('click', function() {
          var lat = parseFloat(this.getAttribute('data-lat'));
          var lng = parseFloat(this.getAttribute('data-lng'));
          var title = this.getAttribute('data-title');
          activeGpsLocation = { name: title, lat: lat, lng: lng, alt: 25 };
          updateGpsBadge(title, lat, lng);
          box.style.display = 'none';
        });
      });
    } catch (e) {
      box.innerHTML = '<div style="padding:14px; text-align:center; color:#ef4444; font-size:13px;">위치 검색 실패. 인터넷 연결을 확인해 주세요.</div>';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '장소 검색'; }
    }
  };

  function updateGpsBadge(name, lat, lng) {
    var b = byId('gpsSelectedBadge');
    if (b) {
      b.innerHTML = '📍 <strong>' + esc(name) + '</strong> (' + lat.toFixed(4) + ', ' + lng.toFixed(4) + ') 적용 중';
    }
  }

  // ──────────────────────────────────────────
  // 6. TAB 2: 애드센스 & 블로그 규격화 모듈
  // ──────────────────────────────────────────
  var tab2Items = [];
  var LIMITS = { maxSide: 1200, maxBytes: 300 * 1024 };

  function slugify(v) {
    return String(v || '').toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-+|-+$/g, '') || 'blog-photo';
  }

  function applySlugNames() {
    var slugInput = byId('prepSlugInput');
    var slug = slugify(slugInput ? slugInput.value : '');
    var digits = Math.max(2, String(tab2Items.length).length);
    tab2Items.forEach(function(item, i) {
      if (!item.result) return;
      var no = String(i + 1);
      while (no.length < digits) no = '0' + no;
      item.result.name = slug + '-' + no + '.jpg';
    });
  }

  function drawScaled(img, w, h) {
    var src = img, sw = img.naturalWidth, sh = img.naturalHeight;
    var steps = [];
    while (sw / 2 >= w && sh / 2 >= h) {
      var step = document.createElement('canvas');
      step.width = Math.round(sw / 2);
      step.height = Math.round(sh / 2);
      var sctx = step.getContext('2d');
      sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(src, 0, 0, step.width, step.height);
      steps.push(step);
      src = step; sw = step.width; sh = step.height;
    }
    var canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, w, h);
    steps.forEach(function(c) { c.width = 0; c.height = 0; });
    return canvas;
  }

  function toJpeg(canvas, quality) {
    return new Promise(function(resolve) { canvas.toBlob(resolve, 'image/jpeg', quality); });
  }

  async function prepareOne(file) {
    var source = await browserReadableBlob(file, 0.9);
    var img = await loadImage(source);
    var w = img.naturalWidth, h = img.naturalHeight;
    var side = Math.max(w, h);
    var scale = side > LIMITS.maxSide ? LIMITS.maxSide / side : 1;
    var targetW = Math.max(1, Math.round(w * scale));
    var targetH = Math.max(1, Math.round(h * scale));
    var kind = w > h ? '가로형' : (h > w ? '세로형' : '정사각형');

    var canvas = drawScaled(img, targetW, targetH);
    var quality = 0.85;
    var blob = await toJpeg(canvas, quality);
    while (blob && blob.size > LIMITS.maxBytes && quality > 0.55) {
      quality = Math.round((quality - 0.05) * 100) / 100;
      blob = await toJpeg(canvas, quality);
    }
    canvas.width = 0; canvas.height = 0;
    if (!blob) throw new Error('변환 실패');

    return {
      blob: blob,
      url: URL.createObjectURL(blob),
      name: '',
      kind: kind,
      from: w + '×' + h,
      to: targetW + '×' + targetH,
      size: blob.size,
      saving: Math.round((1 - (blob.size / file.size)) * 100)
    };
  }

  function renderTab2Table() {
    var tbody = byId('prepTableBody');
    if (!tbody) return;
    if (tab2Items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">정리할 사진을 추가해 주세요.</td></tr>';
      return;
    }
    applySlugNames();
    tbody.innerHTML = tab2Items.map(function(item, idx) {
      var r = item.result;
      return '<tr>' +
        '<td style="font-weight:700;">#' + (idx + 1) + '</td>' +
        '<td style="max-width:180px; overflow:hidden; text-overflow:ellipsis;" title="' + esc(item.file.name) + '">' + esc(item.file.name) + '</td>' +
        '<td>' + (r ? r.kind : '-') + '</td>' +
        '<td>' + (r ? r.from + ' ➔ <strong>' + r.to + '</strong>' : '-') + '</td>' +
        '<td>' + kb(item.file.size) + ' ➔ ' + (r ? '<strong style="color:#10b981;">' + kb(r.size) + '</strong> (' + r.saving + '% 절감)' : '대기') + '</td>' +
        '<td>' + (r ? '<code style="background:#e0e7ff; color:#3730a3; padding:2px 6px; border-radius:4px; font-size:12px;">' + esc(r.name) + '</code>' : '-') + '</td>' +
        '<td>' + (r ? '<a href="' + r.url + '" download="' + esc(r.name) + '" style="color:#4f46e5; font-weight:700; text-decoration:none;">다운로드</a>' : '-') + '</td>' +
      '</tr>';
    }).join('');
  }

  async function runTab2Process() {
    if (!tab2Items.length) { alert('정리할 이미지를 먼저 추가해 주세요.'); return; }
    var btnStart = byId('btnPrepStart');
    var btnZip = byId('btnPrepZip');
    if (btnStart) btnStart.disabled = true;

    for (var i = 0; i < tab2Items.length; i++) {
      if (!tab2Items[i].result) {
        try {
          tab2Items[i].result = await prepareOne(tab2Items[i].file);
        } catch (e) {
          console.error(e);
        }
        renderTab2Table();
      }
    }
    if (btnStart) btnStart.disabled = false;
    if (btnZip) btnZip.disabled = false;
  }

  async function downloadTab2Zip() {
    var hasResults = tab2Items.some(function(it) { return it.result; });
    if (!hasResults) { await runTab2Process(); }
    var btn = byId('btnPrepZip');
    if (btn) { btn.disabled = true; btn.textContent = '📦 ZIP 압축 중...'; }
    try {
      applySlugNames();
      var zip = new JSZip();
      tab2Items.forEach(function(item) {
        if (item.result && item.result.blob) {
          zip.file(item.result.name, item.result.blob);
        }
      });
      var zipBlob = await zip.generateAsync({ type: 'blob' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      var slug = slugify(byId('prepSlugInput') ? byId('prepSlugInput').value : 'blog-photo');
      a.download = slug + '-optimized.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert('ZIP 오류: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '📦 ZIP 일괄 다운로드'; }
    }
  }

  // ──────────────────────────────────────────
  // 7. 초기화 및 이벤트 리스너 바인딩
  // ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // 탭 1 드롭존
    var drop1 = byId('tab1DropZone');
    var input1 = byId('tab1FileInput');
    if (drop1 && input1) {
      drop1.addEventListener('click', function() { input1.click(); });
      input1.addEventListener('change', function(e) {
        Array.from(e.target.files).forEach(function(f) { tab1Files.push(f); });
        renderTab1List();
      });
      ['dragenter', 'dragover'].forEach(function(evt) {
        drop1.addEventListener(evt, function(e) { e.preventDefault(); drop1.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(function(evt) {
        drop1.addEventListener(evt, function(e) { e.preventDefault(); drop1.classList.remove('dragover'); });
      });
      drop1.addEventListener('drop', function(e) {
        if (e.dataTransfer && e.dataTransfer.files) {
          Array.from(e.dataTransfer.files).forEach(function(f) { tab1Files.push(f); });
          renderTab1List();
        }
      });
    }

    // 탭 2 드롭존
    var drop2 = byId('tab2DropZone');
    var input2 = byId('tab2FileInput');
    if (drop2 && input2) {
      drop2.addEventListener('click', function() { input2.click(); });
      input2.addEventListener('change', function(e) {
        Array.from(e.target.files).forEach(function(f) { tab2Items.push({ file: f, result: null }); });
        renderTab2Table();
      });
      ['dragenter', 'dragover'].forEach(function(evt) {
        drop2.addEventListener(evt, function(e) { e.preventDefault(); drop2.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(function(evt) {
        drop2.addEventListener(evt, function(e) { e.preventDefault(); drop2.classList.remove('dragover'); });
      });
      drop2.addEventListener('drop', function(e) {
        if (e.dataTransfer && e.dataTransfer.files) {
          Array.from(e.dataTransfer.files).forEach(function(f) { tab2Items.push({ file: f, result: null }); });
          renderTab2Table();
        }
      });
    }

    // 품질 슬라이더 텍스트
    var qInput = byId('optQuality');
    var qText = byId('optQualityText');
    if (qInput && qText) {
      qInput.addEventListener('input', function() { qText.textContent = qInput.value + '%'; });
    }

    // GPS 프리셋 셀렉트
    var gpsSelect = byId('optGpsPreset');
    if (gpsSelect) {
      gpsSelect.addEventListener('change', function() {
        var val = this.value;
        if (val === 'random') {
          var keys = Object.keys(GPS_PRESETS);
          var picked = keys[Math.floor(Math.random() * keys.length)];
          activeGpsLocation = GPS_PRESETS[picked];
          updateGpsBadge(activeGpsLocation.name + ' (랜덤)', activeGpsLocation.lat, activeGpsLocation.lng);
        } else if (GPS_PRESETS[val]) {
          activeGpsLocation = GPS_PRESETS[val];
          updateGpsBadge(activeGpsLocation.name, activeGpsLocation.lat, activeGpsLocation.lng);
        }
      });
    }

    // 날짜 프리셋 칩
    var dateChips = document.querySelectorAll('.date-chip');
    dateChips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        dateChips.forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        activeDatePreset = chip.getAttribute('data-date');
        var customWrap = byId('customDateWrap');
        if (customWrap) {
          customWrap.style.display = activeDatePreset === 'custom' ? 'block' : 'none';
        }
      });
    });

    // 버튼 이벤트들 바인딩
    var btnTab1Start = byId('btnTab1Start');
    if (btnTab1Start) btnTab1Start.addEventListener('click', runTab1Conversion);
    var btnTab1Zip = byId('btnTab1Zip');
    if (btnTab1Zip) btnTab1Zip.addEventListener('click', downloadTab1Zip);
    var btnTab1Clear = byId('btnTab1Clear');
    if (btnTab1Clear) btnTab1Clear.addEventListener('click', function() {
      tab1Files = [];
      tab1Results.forEach(function(r) { if (r && r.url) URL.revokeObjectURL(r.url); });
      tab1Results = [];
      renderTab1List();
      byId('tab1Status').textContent = '';
    });

    var btnPrepStart = byId('btnPrepStart');
    if (btnPrepStart) btnPrepStart.addEventListener('click', runTab2Process);
    var btnPrepZip = byId('btnPrepZip');
    if (btnPrepZip) btnPrepZip.addEventListener('click', downloadTab2Zip);
    var btnPrepClear = byId('btnPrepClear');
    if (btnPrepClear) btnPrepClear.addEventListener('click', function() {
      tab2Items.forEach(function(it) { if (it.result && it.result.url) URL.revokeObjectURL(it.result.url); });
      tab2Items = [];
      renderTab2Table();
    });

    var slugInput = byId('prepSlugInput');
    if (slugInput) slugInput.addEventListener('input', renderTab2Table);
  });

})();
