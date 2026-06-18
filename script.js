/* =========================================================
   PURPLE CLOVER CREATIONS — playful interactions
   ========================================================= */
(function () {
  "use strict";

  /* ----- year ----- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ----- scroll reveal ----- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- back to top ----- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    var onScroll = function () {
      if (window.scrollY > 600) toTop.classList.add("show");
      else toTop.classList.remove("show");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----- PULL THE YARN reveal ----- */
  var basket = document.querySelector(".basket");
  var ball = document.getElementById("yarnBall");
  var strg = document.querySelector(".yarn-string");
  var panel = document.getElementById("secretPanel");

  if (basket && ball && strg) {
    var dragging = false;
    var moved = 0;
    var startY = 0;
    var pullPx = 0;
    var THRESH = 70;
    var MAXPULL = 96;

    function setOpen(open) {
      basket.setAttribute("data-open", open ? "true" : "false");
      ball.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.setAttribute("aria-hidden", open ? "false" : "true");
      pullPx = open ? MAXPULL : 0;
      strg.style.height = (24 + (open ? MAXPULL : 0)) + "px";
    }

    ball.style.transition = "transform .35s cubic-bezier(.34,1.56,.64,1)";
    strg.style.transition = "height .35s cubic-bezier(.34,1.56,.64,1)";

    ball.addEventListener("pointerdown", function (ev) {
      dragging = true;
      moved = 0;
      startY = ev.clientY;
      ball.style.transition = "none";
      strg.style.transition = "none";
      ball.setPointerCapture(ev.pointerId);
    });

    ball.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      var delta = Math.max(0, ev.clientY - startY);
      if (Math.abs(delta) > 6) moved++;
      pullPx = Math.min(delta, MAXPULL);
      strg.style.height = (24 + pullPx) + "px";
      ball.style.transform = "translateY(" + pullPx + "px)";
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      ball.style.transition = "transform .35s cubic-bezier(.34,1.56,.64,1)";
      strg.style.transition = "height .35s cubic-bezier(.34,1.56,.64,1)";
      var currentlyOpen = basket.getAttribute("data-open") === "true";
      if (moved < 2) {
        // a tap/click → toggle
        setOpen(!currentlyOpen);
      } else if (pullPx > THRESH) {
        setOpen(true);
      } else {
        // snap back to current open state
        setOpen(currentlyOpen);
      }
    }
    ball.addEventListener("pointerup", endDrag);
    ball.addEventListener("pointercancel", endDrag);

    // keyboard support
    ball.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        setOpen(basket.getAttribute("data-open") !== "true");
      }
    });
  }

  /* ----- FORM success + confetti ----- */
  var form = document.getElementById("dreamForm");
  var success = document.getElementById("formSuccess");
  var resetBtn = document.getElementById("resetForm");

  function burst(container) {
    var colors = ["#9D6FE0", "#8FD8B6", "#FFE27A", "#FF9DC0", "#FF6B6B"];
    for (var i = 0; i < 26; i++) {
      var b = document.createElement("span");
      b.className = "bit";
      b.style.background = colors[i % colors.length];
      b.style.left = (42 + Math.random() * 16) + "%";
      b.style.top = (18 + Math.random() * 10) + "%";
      var ang = Math.random() * Math.PI * 2;
      var dist = 80 + Math.random() * 160;
      b.style.setProperty("--x", Math.cos(ang) * dist + "px");
      b.style.setProperty("--y", Math.sin(ang) * dist + "px");
      b.style.animationDelay = (Math.random() * 0.15) + "s";
      container.appendChild(b);
      (function (node) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1200);
      })(b);
    }
  }

  if (form && success) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      // basic validity
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var ok = true;
      [name, email].forEach(function (f) {
        if (!f.value.trim() || (f.type === "email" && !f.checkValidity())) {
          ok = false;
          f.style.borderColor = "var(--crayon)";
          f.focus();
        } else {
          f.style.borderColor = "";
        }
      });
      if (!ok) return;

      form.hidden = true;
      success.hidden = false;
      var burstBox = success.querySelector(".success-burst") || success;
      burst(burstBox);
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        form.hidden = false;
        success.hidden = true;
      });
    }
  }

  /* ----- gentle parallax on hero floaties (pointer devices) ----- */
  if (window.matchMedia("(pointer:fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
    var hero = document.querySelector(".hero");
    var floaties = document.querySelectorAll(".floaty, .hero-mascot");
    if (hero) {
      hero.addEventListener("mousemove", function (ev) {
        var r = hero.getBoundingClientRect();
        var cx = (ev.clientX - r.left) / r.width - 0.5;
        var cy = (ev.clientY - r.top) / r.height - 0.5;
        floaties.forEach(function (el, i) {
          var depth = (i + 1) * 6;
          el.style.transform = "translate(" + (cx * depth) + "px," + (cy * depth) + "px)";
        });
      });
    }
  }
})();

/* =========================================================
   CUSTOM STUFFY WORKSHOP
   A self-contained builder: picks feed an inline-SVG preview.
   ========================================================= */
(function () {
  "use strict";

  var svg = document.getElementById("wsSvg");
  if (!svg) return; // workshop not on the page

  var CREATURES = [
    { id: "bunny", name: "Bunny", emoji: "🐰" },
    { id: "cat", name: "Kitty", emoji: "🐱" },
    { id: "bear", name: "Bear", emoji: "🐻" },
    { id: "dragon", name: "Dragon", emoji: "🐲" },
    { id: "penguin", name: "Penguin", emoji: "🐧" },
    { id: "octo", name: "Octopus", emoji: "🐙" }
  ];

  var COLORS = [
    { id: "lavender", hex: "#C9A6F0", name: "lavender" },
    { id: "mint", hex: "#8FD8B6", name: "mint" },
    { id: "butter", hex: "#FFE27A", name: "buttercup" },
    { id: "pink", hex: "#FF9DC0", name: "bubblegum" },
    { id: "sky", hex: "#9DD6F0", name: "sky" },
    { id: "peach", hex: "#FFB89A", name: "peach" },
    { id: "cream", hex: "#F2E8CF", name: "oatmeal" },
    { id: "grape", hex: "#9D6FE0", name: "grape" }
  ];

  var FACES = [
    { id: "happy", name: "Happy" },
    { id: "sleepy", name: "Sleepy" },
    { id: "cheeky", name: "Cheeky" },
    { id: "surprised", name: "Starstruck" },
    { id: "calm", name: "Calm" }
  ];

  var EXTRAS = [
    { id: "none", name: "Just as is", emoji: "✨" },
    { id: "scarf", name: "Cozy scarf", emoji: "🧣" },
    { id: "bow", name: "Tiny bow", emoji: "🎀" },
    { id: "flower", name: "Flower", emoji: "🌸" },
    { id: "hat", name: "Party hat", emoji: "🎉" }
  ];

  var CUDDLE_BASE = { bunny: 7, cat: 6, bear: 9, dragon: 5, penguin: 7, octo: 8 };
  var CUDDLE_EXTRA = { none: 0, scarf: 1, bow: 2, flower: 1, hat: 0 };
  var TOTAL_STEPS = 7;
  var INK = "#3a2a55";
  var CREAM = "#FFFDF7";

  var state = {
    step: 0,
    creature: "bunny",
    body: "lavender",
    accent: "pink",
    face: "happy",
    extra: "none",
    name: ""
  };

  /* ---------- lookups ---------- */
  function find(arr, id) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return arr[i];
    }
    return arr[0];
  }
  function colorById(id) { return find(COLORS, id); }
  function creatureById(id) { return find(CREATURES, id); }
  function faceById(id) { return find(FACES, id); }
  function extraById(id) { return find(EXTRAS, id); }

  /* mix a hex toward black by amt (0..1) for shadow/stitch tones */
  function shade(hex, amt) {
    var h = String(hex).replace("#", "");
    var r = parseInt(h.substring(0, 2), 16);
    var g = parseInt(h.substring(2, 4), 16);
    var b = parseInt(h.substring(4, 6), 16);
    r = Math.max(0, Math.round(r * (1 - amt)));
    g = Math.max(0, Math.round(g * (1 - amt)));
    b = Math.max(0, Math.round(b * (1 - amt)));
    function pad(v) { var s = v.toString(16); return s.length < 2 ? "0" + s : s; }
    return "#" + pad(r) + pad(g) + pad(b);
  }

  function escapeXml(s) {
    return String(s).replace(/[<>&'"]/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c];
    });
  }
  function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }

  /* ---------- SVG builders ---------- */
  function ground() {
    return '<ellipse cx="160" cy="276" rx="96" ry="14" fill="#000" opacity=".07"/>';
  }

  function stitchLines(body, cx, cy, rx, ry) {
    var s = shade(body, 0.22);
    return ""
      + '<path d="M' + (cx - rx) + " " + cy + " Q" + cx + " " + (cy - ry) + " " + (cx + rx) + " " + cy + '" stroke="' + s + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".4"/>'
      + '<path d="M' + (cx - rx * 0.8) + " " + (cy + ry * 0.5) + " Q" + cx + " " + (cy + ry * 0.1) + " " + (cx + rx * 0.8) + " " + (cy + ry * 0.5) + '" stroke="' + s + '" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".35"/>';
  }

  function creatureBody(creature, body, accent) {
    var dark = shade(body, 0.18);
    if (creature === "bunny") {
      return ""
        + '<ellipse cx="130" cy="64" rx="17" ry="54" fill="' + body + '" transform="rotate(-13 130 64)"/>'
        + '<ellipse cx="190" cy="64" rx="17" ry="54" fill="' + body + '" transform="rotate(13 190 64)"/>'
        + '<ellipse cx="130" cy="74" rx="8" ry="38" fill="' + accent + '" transform="rotate(-13 130 74)" opacity=".85"/>'
        + '<ellipse cx="190" cy="74" rx="8" ry="38" fill="' + accent + '" transform="rotate(13 190 74)" opacity=".85"/>'
        + '<ellipse cx="160" cy="192" rx="80" ry="82" fill="' + body + '"/>'
        + stitchLines(body, 160, 208, 64, 46)
        + '<ellipse cx="120" cy="260" rx="24" ry="13" fill="' + body + '"/>'
        + '<ellipse cx="200" cy="260" rx="24" ry="13" fill="' + body + '"/>'
        + '<ellipse cx="86" cy="212" rx="16" ry="30" fill="' + dark + '" transform="rotate(22 86 212)"/>'
        + '<ellipse cx="234" cy="212" rx="16" ry="30" fill="' + dark + '" transform="rotate(-22 234 212)"/>';
    }
    if (creature === "cat") {
      return ""
        + '<path d="M100 116 L86 38 L156 100 Z" fill="' + body + '"/>'
        + '<path d="M220 116 L234 38 L164 100 Z" fill="' + body + '"/>'
        + '<path d="M104 108 L98 62 L134 96 Z" fill="' + accent + '" opacity=".75"/>'
        + '<path d="M216 108 L222 62 L186 96 Z" fill="' + accent + '" opacity=".75"/>'
        + '<ellipse cx="160" cy="192" rx="78" ry="80" fill="' + body + '"/>'
        + stitchLines(body, 160, 208, 62, 44)
        + '<path d="M236 228 Q286 232 288 196 Q290 158 254 168" fill="none" stroke="' + body + '" stroke-width="16" stroke-linecap="round"/>'
        + '<ellipse cx="120" cy="260" rx="22" ry="12" fill="' + body + '"/>'
        + '<ellipse cx="200" cy="260" rx="22" ry="12" fill="' + body + '"/>';
    }
    if (creature === "bear") {
      return ""
        + '<circle cx="108" cy="108" r="26" fill="' + body + '"/>'
        + '<circle cx="212" cy="108" r="26" fill="' + body + '"/>'
        + '<circle cx="108" cy="112" r="13" fill="' + accent + '" opacity=".75"/>'
        + '<circle cx="212" cy="112" r="13" fill="' + accent + '" opacity=".75"/>'
        + '<ellipse cx="160" cy="196" rx="82" ry="80" fill="' + body + '"/>'
        + stitchLines(body, 160, 212, 66, 46)
        + '<ellipse cx="160" cy="220" rx="36" ry="28" fill="' + CREAM + '"/>'
        + '<ellipse cx="120" cy="262" rx="24" ry="13" fill="' + body + '"/>'
        + '<ellipse cx="200" cy="262" rx="24" ry="13" fill="' + body + '"/>'
        + '<ellipse cx="84" cy="214" rx="16" ry="28" fill="' + dark + '" transform="rotate(20 84 214)"/>'
        + '<ellipse cx="236" cy="214" rx="16" ry="28" fill="' + dark + '" transform="rotate(-20 236 214)"/>';
    }
    if (creature === "dragon") {
      return ""
        + '<path d="M122 94 L112 32 L140 84 Z" fill="' + CREAM + '"/>'
        + '<path d="M198 94 L208 32 L180 84 Z" fill="' + CREAM + '"/>'
        + '<path d="M86 168 Q24 126 36 200 Q44 236 86 214 Z" fill="' + accent + '" opacity=".85"/>'
        + '<path d="M234 168 Q296 126 284 200 Q276 236 234 214 Z" fill="' + accent + '" opacity=".85"/>'
        + '<ellipse cx="160" cy="196" rx="80" ry="80" fill="' + body + '"/>'
        + '<ellipse cx="160" cy="224" rx="46" ry="38" fill="' + CREAM + '" opacity=".92"/>'
        + stitchLines(body, 160, 182, 58, 28)
        + '<path d="M244 252 L288 268 L244 282 Z" fill="' + accent + '"/>'
        + '<ellipse cx="120" cy="260" rx="22" ry="12" fill="' + body + '"/>'
        + '<ellipse cx="200" cy="260" rx="22" ry="12" fill="' + body + '"/>';
    }
    if (creature === "penguin") {
      return ""
        + '<ellipse cx="160" cy="196" rx="76" ry="84" fill="' + body + '"/>'
        + '<ellipse cx="160" cy="226" rx="44" ry="48" fill="' + CREAM + '"/>'
        + stitchLines(body, 160, 166, 52, 18)
        + '<ellipse cx="84" cy="200" rx="16" ry="40" fill="' + dark + '" transform="rotate(18 84 200)"/>'
        + '<ellipse cx="236" cy="200" rx="16" ry="40" fill="' + dark + '" transform="rotate(-18 236 200)"/>'
        + '<path d="M150 188 L170 188 L160 202 Z" fill="#FF9F40"/>'
        + '<ellipse cx="132" cy="276" rx="20" ry="10" fill="#FF9F40"/>'
        + '<ellipse cx="188" cy="276" rx="20" ry="10" fill="#FF9F40"/>';
    }
    if (creature === "octo") {
      return ""
        + '<path d="M88 220 Q74 260 94 278 Q108 262 102 232 Z" fill="' + body + '"/>'
        + '<path d="M116 232 Q108 272 130 282 Q140 264 130 238 Z" fill="' + body + '"/>'
        + '<path d="M146 240 Q144 282 160 286 Q160 264 158 244 Z" fill="' + body + '"/>'
        + '<path d="M174 240 Q176 282 160 286 Q160 264 162 244 Z" fill="' + body + '"/>'
        + '<path d="M204 232 Q212 272 190 282 Q180 264 190 238 Z" fill="' + body + '"/>'
        + '<path d="M232 220 Q246 260 226 278 Q212 262 218 232 Z" fill="' + body + '"/>'
        + '<circle cx="160" cy="158" r="90" fill="' + body + '"/>'
        + stitchLines(body, 160, 172, 78, 50)
        + '<circle cx="96" cy="196" r="14" fill="' + accent + '" opacity=".5"/>'
        + '<circle cx="224" cy="196" r="14" fill="' + accent + '" opacity=".5"/>';
    }
    return "";
  }

  function dot(x, y, r, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>'; }
  function shine(x, y) { return '<circle cx="' + (x + 2) + '" cy="' + (y - 2) + '" r="2.2" fill="#fff"/>'; }
  function blushes() {
    return '<ellipse cx="116" cy="186" rx="10" ry="6" fill="#FF9DC0" opacity=".55"/>'
         + '<ellipse cx="204" cy="186" rx="10" ry="6" fill="#FF9DC0" opacity=".55"/>';
  }

  function faceParts(face, creature) {
    var lx = 138, rx = 182, eyeY = 168, mouthY = 196;
    var noMouth = creature === "penguin"; // beak already drawn
    if (face === "happy") {
      return dot(lx, eyeY, 7, INK) + shine(lx, eyeY) + dot(rx, eyeY, 7, INK) + shine(rx, eyeY)
        + (noMouth ? "" : '<path d="M148 ' + mouthY + " Q160 " + (mouthY + 10) + " 172 " + mouthY + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>')
        + blushes();
    }
    if (face === "sleepy") {
      return ""
        + '<path d="M' + (lx - 7) + " " + (eyeY + 2) + " Q" + lx + " " + (eyeY + 9) + " " + (lx + 7) + " " + (eyeY + 2) + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        + '<path d="M' + (rx - 7) + " " + (eyeY + 2) + " Q" + rx + " " + (eyeY + 9) + " " + (rx + 7) + " " + (eyeY + 2) + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        + (noMouth ? "" : '<path d="M150 ' + mouthY + " Q160 " + (mouthY + 6) + " 170 " + mouthY + '" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>')
        + blushes()
        + '<text x="226" y="150" font-size="20" aria-hidden="true">💤</text>';
    }
    if (face === "cheeky") {
      return dot(lx, eyeY, 7, INK) + shine(lx, eyeY)
        + '<path d="M' + (rx - 7) + " " + (eyeY + 2) + " Q" + rx + " " + (eyeY + 9) + " " + (rx + 7) + " " + (eyeY + 2) + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>'
        + (noMouth ? "" : '<path d="M148 ' + (mouthY - 2) + " Q160 " + (mouthY + 14) + " 174 " + (mouthY - 2) + " Q168 " + (mouthY + 4) + " 160 " + (mouthY + 7) + " Q152 " + (mouthY + 4) + " 148 " + (mouthY - 2) + ' Z" fill="' + INK + '"/>')
        + blushes();
    }
    if (face === "surprised") {
      return dot(lx, eyeY, 8, INK) + shine(lx, eyeY) + dot(rx, eyeY, 8, INK) + shine(rx, eyeY)
        + (noMouth ? "" : '<ellipse cx="160" cy="' + (mouthY + 3) + '" rx="6" ry="8" fill="' + INK + '"/>')
        + blushes();
    }
    if (face === "calm") {
      return dot(lx, eyeY, 5.5, INK) + dot(rx, eyeY, 5.5, INK)
        + (noMouth ? "" : '<path d="M150 ' + mouthY + " Q160 " + (mouthY + 5) + " 170 " + mouthY + '" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>')
        + blushes();
    }
    return "";
  }

  function extraParts(extra, accent) {
    if (extra === "scarf") {
      return '<path d="M82 246 Q160 268 238 246 L238 262 Q160 282 82 262 Z" fill="' + accent + '"/>'
        + '<rect x="78" y="258" width="14" height="32" rx="5" fill="' + shade(accent, 0.15) + '"/>'
        + '<path d="M78 258 l7 9 l7 -9 M78 274 l7 9 l7 -9" stroke="' + shade(accent, 0.32) + '" stroke-width="2" fill="none"/>';
    }
    if (extra === "bow") {
      return '<g transform="translate(112 118)">'
        + '<path d="M0 0 L-24 -15 L-24 15 Z" fill="' + accent + '"/>'
        + '<path d="M0 0 L24 -15 L24 15 Z" fill="' + accent + '"/>'
        + '<circle cx="0" cy="0" r="8" fill="' + shade(accent, 0.2) + '"/>'
        + "</g>";
    }
    if (extra === "flower") {
      var p = "";
      var degs = [0, 72, 144, 216, 288];
      for (var i = 0; i < degs.length; i++) {
        p += '<ellipse cx="0" cy="-13" rx="7" ry="11" fill="' + accent + '" transform="translate(206 122) rotate(' + degs[i] + ')"/>';
      }
      return p + '<circle cx="206" cy="122" r="7" fill="#FFE27A"/>';
    }
    if (extra === "hat") {
      return '<path d="M126 96 L160 26 L194 96 Z" fill="' + accent + '"/>'
        + '<circle cx="160" cy="26" r="9" fill="#FFE27A"/>'
        + '<rect x="118" y="92" width="84" height="11" rx="5" fill="' + shade(accent, 0.22) + '"/>';
    }
    return "";
  }

  /* ---------- main render ---------- */
  function render(faceOverride) {
    var face = faceOverride || state.face;
    var body = colorById(state.body).hex;
    var accent = colorById(state.accent).hex;
    svg.innerHTML = ground()
      + creatureBody(state.creature, body, accent)
      + extraParts(state.extra, accent)
      + faceParts(face, state.creature);
    updateChrome();
  }

  function taglineFor() {
    var lines = {
      bunny: "a hoppy, snuggly crochet pal",
      cat: "a purr-fectly soft little friend",
      bear: "a big-hearted huggable bear",
      dragon: "a tiny, gentle dragon friend",
      penguin: "a waddling, chilly little buddy",
      octo: "eight arms of pure squish"
    };
    return lines[state.creature] || "a custom crochet pal";
  }

  function cuddleScore() {
    var base = CUDDLE_BASE[state.creature] || 6;
    var bonus = CUDDLE_EXTRA[state.extra] || 0;
    if (state.face === "cheeky") bonus += 1;
    if (state.face === "happy") bonus += 1;
    return Math.max(1, Math.min(10, base + bonus));
  }

  function updateChrome() {
    var nm = (state.name && state.name.trim()) || "your friend";
    setText("wsNametagText", nm);

    var cuddle = cuddleScore();
    setText("wsMeterValue", cuddle);
    var bar = document.getElementById("wsMeterBar");
    if (bar) bar.style.width = cuddle * 10 + "%";

    setText("wsSummary",
      creatureById(state.creature).name + " · " +
      colorById(state.body).name + " · " +
      faceById(state.face).name + " · " +
      extraById(state.extra).name);

    fillCard();
  }

  function fillCard() {
    var art = document.getElementById("wsCardArt");
    if (art) art.innerHTML = svg.innerHTML;
    var nm = (state.name && state.name.trim()) || "your friend";
    setText("wsCardName", nm);
    setText("wsCardTag", taglineFor());
    setText("wsCardCreature", creatureById(state.creature).name);
    setText("wsCardBodyColor", colorById(state.body).name);
    setText("wsCardAccent", colorById(state.accent).name);
    setText("wsCardFace", faceById(state.face).name);
    setText("wsCardExtra", extraById(state.extra).name);
    setText("wsCardMade", "made for " + nm + " with yarn & love at the Purple Clover Workshop 🍀");
  }

  /* ---------- choice buttons ---------- */
  function faceEmoji(id) {
    return ({ happy: "😄", sleepy: "😴", cheeky: "😜", surprised: "😮", calm: "🙂" })[id] || "😊";
  }

  function choiceButton(value, label, emoji, currentId, onPick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ws-choice";
    b.dataset.value = value;
    b.setAttribute("aria-pressed", currentId === value ? "true" : "false");
    b.innerHTML = '<span class="ws-choice-emoji" aria-hidden="true">' + emoji + "</span>"
                + '<span class="ws-choice-label">' + label + "</span>";
    b.addEventListener("click", function () { onPick(); });
    return b;
  }

  function colorButton(col, currentId, key, containerId) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "ws-choice ws-choice--color";
    b.dataset.value = col.id;
    b.setAttribute("aria-pressed", currentId === col.id ? "true" : "false");
    b.setAttribute("aria-label", col.name + " yarn");
    b.innerHTML = '<span class="ws-swatch" style="background:' + col.hex + '" aria-hidden="true"></span>'
                + '<span class="ws-choice-label">' + col.name + "</span>";
    b.addEventListener("click", function () {
      if (key === "body") state.body = col.id; else state.accent = col.id;
      render();
      refreshSelected(containerId, col.id);
    });
    return b;
  }

  function refreshSelected(containerId, value) {
    var nodes = document.getElementById(containerId).querySelectorAll(".ws-choice");
    for (var i = 0; i < nodes.length; i++) {
      var on = nodes[i].dataset.value === value;
      nodes[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function buildChoices() {
    var cc = document.getElementById("wsCreatures");
    CREATURES.forEach(function (c) {
      cc.appendChild(choiceButton(c.id, c.name, c.emoji, state.creature, function () {
        state.creature = c.id; render(); refreshSelected("wsCreatures", c.id);
      }));
    });
    var bc = document.getElementById("wsBodyColors");
    COLORS.forEach(function (col) { bc.appendChild(colorButton(col, state.body, "body", "wsBodyColors")); });
    var ac = document.getElementById("wsAccentColors");
    COLORS.forEach(function (col) { ac.appendChild(colorButton(col, state.accent, "accent", "wsAccentColors")); });
    var fc = document.getElementById("wsFaces");
    FACES.forEach(function (f) {
      var b = choiceButton(f.id, f.name, faceEmoji(f.id), state.face, function () {
        state.face = f.id; render(); refreshSelected("wsFaces", f.id);
      });
      b.addEventListener("mouseenter", function () { render(f.id); });
      b.addEventListener("mouseleave", function () { render(); });
      b.addEventListener("focus", function () { render(f.id); });
      b.addEventListener("blur", function () { render(); });
      fc.appendChild(b);
    });
    var ec = document.getElementById("wsExtras");
    EXTRAS.forEach(function (e) {
      ec.appendChild(choiceButton(e.id, e.name, e.emoji, state.extra, function () {
        state.extra = e.id; render(); refreshSelected("wsExtras", e.id);
      }));
    });
  }

  /* ---------- step navigation ---------- */
  function goToStep(n) {
    state.step = Math.max(0, Math.min(TOTAL_STEPS - 1, n));
    var panels = document.querySelectorAll(".ws-panel");
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.toggle("is-active", parseInt(panels[i].dataset.panel, 10) === state.step);
    }
    var rail = document.querySelectorAll("#wsRail li");
    for (var j = 0; j < rail.length; j++) {
      var idx = parseInt(rail[j].dataset.step, 10);
      rail[j].classList.toggle("is-active", idx === state.step);
      rail[j].classList.toggle("is-done", idx < state.step);
    }
    var back = document.getElementById("wsBack");
    var next = document.getElementById("wsNext");
    if (back) back.disabled = state.step === 0;
    if (next) next.textContent = state.step === TOTAL_STEPS - 1 ? "✨ All done!" : "Next stitch →";
    render();
  }

  function resetAll() {
    state.step = 0;
    state.creature = "bunny";
    state.body = "lavender";
    state.accent = "pink";
    state.face = "happy";
    state.extra = "none";
    state.name = "";
    var input = document.getElementById("wsNameInput");
    if (input) input.value = "";
    refreshSelected("wsCreatures", "bunny");
    refreshSelected("wsBodyColors", "lavender");
    refreshSelected("wsAccentColors", "pink");
    refreshSelected("wsFaces", "happy");
    refreshSelected("wsExtras", "none");
    goToStep(0);
  }

  function shakeBasket() {
    state.creature = randFrom(CREATURES).id;
    state.body = randFrom(COLORS).id;
    state.accent = randFrom(COLORS).id;
    state.face = randFrom(FACES).id;
    state.extra = randFrom(EXTRAS).id;
    refreshSelected("wsCreatures", state.creature);
    refreshSelected("wsBodyColors", state.body);
    refreshSelected("wsAccentColors", state.accent);
    refreshSelected("wsFaces", state.face);
    refreshSelected("wsExtras", state.extra);
    var stage = document.getElementById("wsStage");
    if (stage) {
      stage.classList.remove("ws-shaking");
      void stage.offsetWidth; // force reflow to restart animation
      stage.classList.add("ws-shaking");
    }
    render();
  }

  function downloadCard() {
    var nm = (state.name && state.name.trim()) || "my-stuffy";
    var body = colorById(state.body).hex;
    var accent = colorById(state.accent).hex;
    var inner = ground()
      + creatureBody(state.creature, body, accent)
      + extraParts(state.extra, accent)
      + faceParts(state.face, state.creature);
    var label = '<text x="160" y="308" font-family="Fredoka, sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="#4A3B6B">' + escapeXml(nm) + "</text>";
    var tagline = '<text x="160" y="28" font-family="Nunito, sans-serif" font-size="13" text-anchor="middle" fill="#7B4FC4">Purple Clover Workshop · ' + escapeXml(taglineFor()) + "</text>";
    var fullSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" width="640" height="640">'
      + '<rect width="320" height="320" fill="#FFF8EA"/>'
      + tagline + inner + label + "</svg>";
    try {
      var blob = new Blob([fullSvg], { type: "image/svg+xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = nm.toLowerCase().replace(/\s+/g, "-") + "-stuffy.svg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } catch (err) {
      // download unsupported — quietly no-op (preview still works)
    }
  }

  /* ---------- wire it up ---------- */
  buildChoices();

  document.getElementById("wsNext").addEventListener("click", function () { goToStep(state.step + 1); });
  document.getElementById("wsBack").addEventListener("click", function () { goToStep(state.step - 1); });
  document.getElementById("wsReset").addEventListener("click", resetAll);
  document.getElementById("wsShake").addEventListener("click", shakeBasket);
  document.getElementById("wsDownload").addEventListener("click", downloadCard);

  var railItems = document.querySelectorAll("#wsRail li");
  for (var r = 0; r < railItems.length; r++) {
    (function (li) {
      li.setAttribute("role", "button");
      li.addEventListener("click", function () { goToStep(parseInt(li.dataset.step, 10)); });
      li.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          goToStep(parseInt(li.dataset.step, 10));
        }
      });
    })(railItems[r]);
  }

  var nameInput = document.getElementById("wsNameInput");
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      var v = nameInput.value.replace(/[^\p{L}\p{N}\s'-]/gu, "").slice(0, 18);
      if (v !== nameInput.value) nameInput.value = v;
      state.name = v;
      render();
    });
  }

  goToStep(0);
})();
