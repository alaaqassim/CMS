/* =========================================================================
   Institutional Excellence Framework — Demo Lifecycle Navigator
   Shared across all prototype screens. RTL-aware, responsive, self-contained.
   ========================================================================= */
(function () {
  "use strict";

  // Ordered lifecycle of the competition management system
  var FLOW = [
    { file: "home.html",        label: "البوابة الرئيسية",   short: "الرئيسية",   icon: "home" },
    { file: "competition.html", label: "تفاصيل المسابقة",    short: "التفاصيل",   icon: "emoji_events" },
    { file: "register.html",    label: "تسجيل متسابق",       short: "التسجيل",    icon: "app_registration" },
    { file: "dashboard.html",   label: "لوحة المتسابق",      short: "اللوحة",     icon: "dashboard" },
    { file: "exam.html",        label: "بيئة الاختبار",       short: "الاختبار",   icon: "quiz" },
    { file: "results.html",     label: "النتائج والتقييم",    short: "النتائج",    icon: "workspace_premium" }
  ];

  // Map recurring UI labels -> destination screen so the real buttons flow
  var LINK_MAP = [
    { rx: /^\s*الرئيسية\s*$/,                    to: "home.html" },
    { rx: /^\s*المسابقات\s*$/,                    to: "competition.html" },
    { rx: /^\s*النتائج\s*$/,                      to: "results.html" },
    { rx: /^\s*عن المنصة\s*$/,                    to: "home.html" },
    { rx: /استكشف المسابقات/,                     to: "competition.html" },
    { rx: /استعراض كافة المسابقات/,               to: "competition.html" },
    { rx: /عرض التفاصيل/,                         to: "competition.html" },
    { rx: /(سجل الآن|التسجيل الآن)/,              to: "register.html" },
    { rx: /تسجيل الدخول/,                         to: "dashboard.html" },
    { rx: /^\s*التالي\s*$/,                       to: "__next_step_form__" },
    { rx: /(بدء الاختبار|ابدأ الاختبار)/,          to: "exam.html" },
    { rx: /(إنهاء وتسليم الاختبار|تسليم الاختبار)/, to: "results.html" },
    { rx: /(المسابقات المتاحة)/,                   to: "competition.html" }
  ];

  var here = (location.pathname.split("/").pop() || "home.html").toLowerCase();
  var idx = FLOW.findIndex(function (s) { return s.file === here; });
  if (idx === -1) idx = 0;

  /* ---------- 1. Wire real buttons / links into the flow ---------- */
  function wireLinks() {
    var nodes = document.querySelectorAll("a, button");
    nodes.forEach(function (el) {
      if (el.closest("#demo-nav")) return;
      var txt = (el.textContent || "").trim();
      if (!txt) return;
      for (var i = 0; i < LINK_MAP.length; i++) {
        if (LINK_MAP[i].rx.test(txt)) {
          var to = LINK_MAP[i].to;
          if (to === "__next_step_form__") return; // multi-step form handled in-page
          if (el.tagName === "A") {
            el.setAttribute("href", to);
          } else {
            el.style.cursor = "pointer";
            el.addEventListener("click", function (u) {
              return function () { location.href = u; };
            }(to));
          }
          return;
        }
      }
    });
  }

  /* ---------- 2. Build the floating lifecycle navigator ---------- */
  function buildNav() {
    var prev = idx > 0 ? FLOW[idx - 1] : null;
    var next = idx < FLOW.length - 1 ? FLOW[idx + 1] : null;

    var wrap = document.createElement("div");
    wrap.id = "demo-nav";
    wrap.dir = "rtl";

    var steps = FLOW.map(function (s, i) {
      var state = i < idx ? "done" : (i === idx ? "current" : "todo");
      return '<a class="dn-step ' + state + '" href="' + s.file + '" title="' + s.label + '">' +
               '<span class="dn-dot"><span class="material-symbols-outlined">' + s.icon + '</span></span>' +
               '<span class="dn-step-label">' + s.label + '</span>' +
             '</a>';
    }).join("");

    wrap.innerHTML =
      '<button id="dn-toggle" aria-label="مسار العرض التوضيحي">' +
        '<span class="material-symbols-outlined">account_tree</span>' +
        '<span class="dn-toggle-txt">' + (idx + 1) + '<span class="dn-toggle-sep">/</span>' + FLOW.length + '</span>' +
      '</button>' +
      '<div id="dn-panel" role="dialog" aria-label="مسار دورة حياة المسابقة">' +
        '<div class="dn-head">' +
          '<div>' +
            '<p class="dn-kicker">عرض توضيحي تفاعلي</p>' +
            '<p class="dn-title">دورة حياة إدارة المسابقات</p>' +
          '</div>' +
          '<button id="dn-close" aria-label="إغلاق"><span class="material-symbols-outlined">close</span></button>' +
        '</div>' +
        '<div class="dn-steps">' + steps + '</div>' +
        '<div class="dn-foot">' +
          (prev ? '<a class="dn-btn ghost" href="' + prev.file + '"><span class="material-symbols-outlined">chevron_right</span>' + prev.short + '</a>' : '<span></span>') +
          (next ? '<a class="dn-btn solid" href="' + next.file + '">' + next.short + '<span class="material-symbols-outlined">chevron_left</span></a>'
                : '<a class="dn-btn solid" href="home.html">إعادة البدء<span class="material-symbols-outlined">restart_alt</span></a>') +
        '</div>' +
      '</div>';

    document.body.appendChild(wrap);

    var panel = document.getElementById("dn-panel");
    document.getElementById("dn-toggle").addEventListener("click", function () {
      wrap.classList.toggle("open");
    });
    document.getElementById("dn-close").addEventListener("click", function () {
      wrap.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") wrap.classList.remove("open");
      if (e.altKey && e.key === "ArrowLeft" && next) location.href = next.file;   // Alt+← next (RTL forward)
      if (e.altKey && e.key === "ArrowRight" && prev) location.href = prev.file;  // Alt+→ prev
    });
    document.addEventListener("click", function (e) {
      if (wrap.classList.contains("open") && !e.target.closest("#demo-nav")) {
        wrap.classList.remove("open");
      }
    });
  }

  /* ---------- 3. Styles (scoped, injected once) ---------- */
  function injectStyles() {
    var css =
    '#demo-nav{position:fixed;z-index:9999;inset-inline-start:0;top:50%;transform:translateY(-50%);font-family:"IBM Plex Sans Arabic",sans-serif;}' +
    '#dn-toggle{display:flex;flex-direction:column;align-items:center;gap:2px;background:#0F172A;color:#fff;border:none;cursor:pointer;' +
      'padding:14px 8px;border-start-end-radius:14px;border-end-end-radius:14px;box-shadow:0 8px 24px -6px rgba(15,23,42,.45);transition:padding .2s,background .2s;}' +
    '#dn-toggle:hover{background:#1E293B;padding-inline-end:12px;}' +
    '#dn-toggle .material-symbols-outlined{font-size:22px;}' +
    '.dn-toggle-txt{font-size:12px;font-weight:700;letter-spacing:.02em;}' +
    '.dn-toggle-sep{opacity:.5;margin:0 1px;}' +
    '#dn-panel{position:absolute;inset-inline-start:calc(100% + 12px);top:50%;transform:translateY(-50%) scale(.96);transform-origin:center left;' +
      'width:300px;max-width:78vw;background:#fff;border:1px solid #E2E8F0;border-radius:16px;box-shadow:0 24px 48px -12px rgba(15,23,42,.28);' +
      'padding:18px;opacity:0;visibility:hidden;transition:opacity .18s ease,transform .18s ease;}' +
    '#demo-nav.open #dn-panel{opacity:1;visibility:visible;transform:translateY(-50%) scale(1);}' +
    '.dn-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:14px;}' +
    '.dn-kicker{font-size:11px;font-weight:600;color:#059669;letter-spacing:.04em;margin:0 0 2px;}' +
    '.dn-title{font-size:16px;font-weight:700;color:#0F172A;margin:0;line-height:1.3;}' +
    '#dn-close{background:#F1F5F9;border:none;border-radius:8px;width:30px;height:30px;cursor:pointer;color:#45464d;display:flex;align-items:center;justify-content:center;}' +
    '#dn-close:hover{background:#E2E8F0;}' +
    '#dn-close .material-symbols-outlined{font-size:18px;}' +
    '.dn-steps{display:flex;flex-direction:column;gap:2px;position:relative;margin-bottom:14px;}' +
    '.dn-step{display:flex;align-items:center;gap:12px;padding:8px 8px;border-radius:10px;text-decoration:none;position:relative;transition:background .15s;}' +
    '.dn-step:hover{background:#F8FAFC;}' +
    '.dn-step .dn-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:2px solid #E2E8F0;background:#fff;color:#76777d;transition:.15s;}' +
    '.dn-step .dn-dot .material-symbols-outlined{font-size:18px;}' +
    '.dn-step-label{font-size:13.5px;font-weight:600;color:#45464d;}' +
    '.dn-step.done .dn-dot{background:#059669;border-color:#059669;color:#fff;}' +
    '.dn-step.done .dn-step-label{color:#191c1e;}' +
    '.dn-step.current .dn-dot{background:#0F172A;border-color:#0F172A;color:#fff;box-shadow:0 0 0 4px rgba(15,23,42,.12);}' +
    '.dn-step.current{background:#F1F5F9;}' +
    '.dn-step.current .dn-step-label{color:#0F172A;font-weight:700;}' +
    '.dn-steps::before{content:"";position:absolute;top:20px;bottom:20px;inset-inline-start:24px;width:2px;background:#E2E8F0;z-index:0;}' +
    '.dn-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:12px;border-top:1px solid #F1F5F9;}' +
    '.dn-btn{display:inline-flex;align-items:center;gap:2px;font-size:13px;font-weight:600;text-decoration:none;padding:8px 12px;border-radius:9px;transition:.15s;}' +
    '.dn-btn .material-symbols-outlined{font-size:18px;}' +
    '.dn-btn.ghost{color:#45464d;background:transparent;}' +
    '.dn-btn.ghost:hover{background:#F1F5F9;}' +
    '.dn-btn.solid{color:#fff;background:#0F172A;}' +
    '.dn-btn.solid:hover{background:#1E293B;}' +
    '@media (max-width:640px){#dn-toggle{padding:10px 6px;}#dn-panel{inset-inline-start:calc(100% + 8px);}}' +
    '@media print{#demo-nav{display:none;}}';
    var tag = document.createElement("style");
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function init() {
    injectStyles();
    wireLinks();
    buildNav();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
