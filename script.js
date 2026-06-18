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
    { id: "calm", name: "Calm" },
    { id: "love", name: "Smitten" },
    { id: "wink", name: "Wink" },
    { id: "smug", name: "Smug" }
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
        + '<path d="M100 150 L86 38 L156 124 Z" fill="' + body + '"/>'
        + '<path d="M220 150 L234 38 L164 124 Z" fill="' + body + '"/>'
        + '<path d="M104 146 L98 62 L134 126 Z" fill="' + accent + '" opacity=".75"/>'
        + '<path d="M216 146 L222 62 L186 126 Z" fill="' + accent + '" opacity=".75"/>'
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
        /* two rounded horns — bases tucked into the head so they grow out of it */
        + '<path d="M150 128 Q120 74 112 52 Q126 92 134 140 Z" fill="' + shade(body, 0.28) + '"/>'
        + '<path d="M170 128 Q200 74 208 52 Q194 92 186 140 Z" fill="' + shade(body, 0.28) + '"/>'
        /* scalloped side wings, anchored at the shoulders and sweeping up-and-out */
        + '<path d="M104 150 Q40 86 26 102 Q44 126 58 138 Q44 156 50 176 Q66 186 84 190 Q96 188 104 184 Z" fill="' + accent + '" opacity=".85"/>'
        + '<path d="M216 150 Q280 86 294 102 Q276 126 262 138 Q276 156 270 176 Q254 186 236 190 Q224 188 216 184 Z" fill="' + accent + '" opacity=".85"/>'
        + '<ellipse cx="160" cy="196" rx="80" ry="80" fill="' + body + '"/>'
        + '<ellipse cx="160" cy="224" rx="46" ry="38" fill="' + CREAM + '" opacity=".92"/>'
        + stitchLines(body, 160, 182, 58, 28)
        + '<ellipse cx="120" cy="260" rx="22" ry="12" fill="' + body + '"/>'
        + '<ellipse cx="200" cy="260" rx="22" ry="12" fill="' + body + '"/>'
        /* spade-tipped tail, root overlapping the body so there's no white gap */
        + '<path d="M216 224 Q252 220 274 236 L304 256 L274 276 Q252 248 210 244 Z" fill="' + accent + '"/>';
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
      /* Tentacles hang from the head as connected lower-body limbs:
         wide rounded bases are drawn first, then the head circle is
         layered over them so each base tucks under the body (no gap).
         Outer arms fan out and curl; inner arms hang shorter. A shade
         underside peeks at each tip for plush dimension. */
      var bw = 12, ty = 200;
      var tent = [
        { bx: 97,  tx: 89,  tip: 278 },   /* outer-left, curls out */
        { bx: 122, tx: 117, tip: 284 },
        { bx: 147, tx: 147, tip: 288 },   /* centre-left, hangs short */
        { bx: 173, tx: 173, tip: 288 },   /* centre-right */
        { bx: 198, tx: 203, tip: 284 },
        { bx: 223, tx: 231, tip: 278 }    /* outer-right, curls out */
      ];
      var arms = "";
      for (var i = 0; i < tent.length; i++) {
        var t = tent[i];
        var L = t.bx - bw, R = t.bx + bw;
        var mid = Math.round(ty + (t.tip - ty) * 0.45);
        var armD = "M" + L + " " + ty + " Q" + t.bx + " " + (ty - 4) + " " + R + " " + ty
          + " C" + R + " " + mid + " " + (t.tx + 7) + " " + (t.tip - 12) + " " + t.tx + " " + t.tip
          + " C" + (t.tx - 7) + " " + (t.tip - 12) + " " + L + " " + mid + " " + L + " " + ty + " Z";
        /* shade underside: same limb nudged down + a touch wider, drawn behind */
        arms += '<path transform="translate(0 3)" d="M' + (L - 1) + " " + ty
          + " Q" + t.bx + " " + (ty - 4) + " " + (R + 1) + " " + ty
          + " C" + (R + 1) + " " + mid + " " + (t.tx + 8) + " " + (t.tip - 12) + " " + t.tx + " " + t.tip
          + " C" + (t.tx - 8) + " " + (t.tip - 12) + " " + (L - 1) + " " + mid + " " + (L - 1) + " " + ty
          + ' Z" fill="' + dark + '" opacity=".28"/>';
        /* body-coloured front of the limb */
        arms += '<path d="' + armD + '" fill="' + body + '"/>';
      }
      return ""
        + arms
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
  /* a tidy heart shape centred at (cx,cy); s scales it (~0.6..1.1) */
  function heart(cx, cy, s, c) {
    return '<path transform="translate(' + cx + " " + cy + ") scale(" + s + ')" '
      + 'd="M0 6 C -10 -6 -22 4 -12 14 C -7 19 0 22 0 24 C 0 22 7 19 12 14 C 22 4 10 -6 0 6 Z" '
      + 'fill="' + c + '"/>';
  }
  /* a single winking eyelid arc (closed eye) */
  function winkArc(x, y) {
    return '<path d="M' + (x - 8) + " " + (y + 1) + " Q" + x + " " + (y + 10) + " " + (x + 8) + " " + (y + 1) + '" '
      + 'stroke="' + INK + '" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
  }

  function faceParts(face, creature) {
    var lx = 138, rx = 182, eyeY = 168, mouthY = 196;
    var noMouth = creature === "penguin"; // beak already drawn
    function smile(deep, w) {
      if (noMouth) return "";
      var hw = (w || 12);
      return '<path d="M' + (160 - hw) + " " + mouthY
        + " Q160 " + (mouthY + (deep || 10)) + " " + (160 + hw) + " " + mouthY
        + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>';
    }
    if (face === "happy") {
      return dot(lx, eyeY, 7, INK) + shine(lx, eyeY) + dot(rx, eyeY, 7, INK) + shine(rx, eyeY)
        + smile(10, 12) + blushes();
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
      /* one open eye + one wink, plus a clean little open mouth with a tongue poking out */
      var cheekyMouth = noMouth ? "" :
          '<path d="M152 ' + mouthY + ' Q160 ' + (mouthY + 11) + ' 168 ' + mouthY + ' Z" fill="' + INK + '"/>'      /* small open mouth */
        + '<path d="M156 ' + (mouthY + 2) + ' Q160 ' + (mouthY + 13) + ' 164 ' + (mouthY + 2) + ' Z" fill="#FF6B6B"/>' /* tongue */
        + '<path d="M152 ' + mouthY + ' Q160 ' + (mouthY + 11) + ' 168 ' + mouthY + '" stroke="' + INK + '" stroke-width="1.6" fill="none"/>';
      return dot(lx, eyeY, 7, INK) + shine(lx, eyeY)
        + winkArc(rx, eyeY)
        + cheekyMouth
        + '<ellipse cx="116" cy="190" rx="12" ry="7" fill="#FF9DC0" opacity=".75"/>'
        + '<ellipse cx="204" cy="190" rx="12" ry="7" fill="#FF9DC0" opacity=".75"/>';
    }
    if (face === "surprised") {
      return dot(lx, eyeY, 8, INK) + shine(lx, eyeY) + dot(rx, eyeY, 8, INK) + shine(rx, eyeY)
        + (noMouth ? "" : '<ellipse cx="160" cy="' + (mouthY + 3) + '" rx="6" ry="8" fill="' + INK + '"/>')
        + blushes()
        + '<g fill="#FFE27A">'
        + '<path d="M160 124 L163 134 L173 134 L165 140 L168 150 L160 144 L152 150 L155 140 L147 134 L157 134 Z"/>'
        + '</g>';
    }
    if (face === "calm") {
      return dot(lx, eyeY, 5.5, INK) + dot(rx, eyeY, 5.5, INK)
        + smile(5, 11) + blushes();
    }
    if (face === "love") {
      return heart(lx, eyeY, 0.62, "#FF6B6B") + heart(rx, eyeY, 0.62, "#FF6B6B")
        + smile(12, 13) + blushes()
        + '<text x="118" y="150" font-size="16" aria-hidden="true">💜</text>';
    }
    if (face === "wink") {
      return dot(lx, eyeY, 7, INK) + shine(lx, eyeY)
        + winkArc(rx, eyeY)
        /* playful asymmetric smirk */
        + (noMouth ? "" :
            '<path d="M150 ' + (mouthY + 1) + ' Q158 ' + (mouthY + 9) + ' 170 ' + (mouthY - 1) + '" stroke="' + INK + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>')
        + blushes();
    }
    if (face === "smug") {
      /* small side-glancing eyes + raised eyebrow + little knowing smirk */
      return dot(lx, eyeY, 5.5, INK) + dot(rx, eyeY, 5.5, INK)
        + '<path d="M' + (rx - 8) + ' ' + (eyeY - 11) + ' q8 -4 16 1" stroke="' + INK + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
        + (noMouth ? "" :
            '<path d="M150 ' + (mouthY + 2) + ' Q159 ' + (mouthY + 4) + ' 170 ' + (mouthY - 2) + '" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>')
        + '<ellipse cx="206" cy="190" rx="12" ry="7" fill="#FF9DC0" opacity=".65"/>';
    }
    return "";
  }

  function extraParts(extra, accent, creature) {
    var aDark = shade(accent, 0.22);
    var aDeep = shade(accent, 0.35);
    /* ---- SCARF: draped around the neck / upper chest, with a hanging tail ----
       The band is lifted to neck level (just under the chin at y≈196) so it
       reads as a scarf, not a belly belt. A small per-creature `neckY` keeps it
       hugging each body's neck line: penguin sits lowest (clear of its beak,
       which reaches y≈202), the round heads sit highest. extraParts is drawn
       before faceParts, so the face/mouth always render on top regardless. */
    if (extra === "scarf") {
      var neckY = { bunny: 199, cat: 199, bear: 201, dragon: 203, penguin: 206, octo: 199 }[creature] || 201;
      var t = neckY;                              /* top edge of the draped band */
      return ""
        + '<path d="M80 ' + t + ' Q160 ' + (t + 22) + ' 240 ' + t + ' L240 ' + (t + 20) + ' Q160 ' + (t + 42) + ' 80 ' + (t + 20) + ' Z" fill="' + accent + '"/>'          /* main band draped across the neck/upper chest */
        + '<path d="M82 ' + (t + 2) + ' Q160 ' + (t + 22) + ' 238 ' + (t + 2) + '" stroke="' + aDark + '" stroke-width="2" fill="none" opacity=".55"/>'                    /* top ridge */
        + '<path d="M80 ' + (t + 18) + ' Q160 ' + (t + 40) + ' 240 ' + (t + 18) + '" stroke="' + aDark + '" stroke-width="2" fill="none" opacity=".45"/>'                  /* bottom ridge */
        + '<path d="M82 ' + (t + 8) + ' Q64 ' + (t + 16) + ' 76 ' + (t + 30) + ' L100 ' + (t + 26) + ' Q94 ' + (t + 14) + ' 98 ' + (t + 2) + ' Z" fill="' + shade(accent, 0.12) + '"/>'  /* knot where the tail tucks under */
        + '<path d="M86 ' + (t + 26) + ' L62 294 L104 ' + (t + 58) + ' Z" fill="' + shade(accent, 0.12) + '"/>'                                                            /* hanging tail over the chest */
        + '<path d="M62 294 l-3 11 M76 290 l-1 13 M90 285 l3 12 M102 280 l6 11" stroke="' + aDeep + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>'           /* fringe at the tail tip */
        + '<path d="M118 ' + (t + 10) + ' l9 -3 M150 ' + (t + 15) + ' l9 -3 M182 ' + (t + 15) + ' l9 -3 M212 ' + (t + 10) + ' l9 -3" stroke="' + aDark + '" stroke-width="2" fill="none" stroke-linecap="round" opacity=".5"/>'; /* crochet dashes */
    }
    /* ---- BOW / FLOWER / HAT are creature-aware: each accessory tucks against
       the current creature's head, ears, horns, or crown instead of one generic
       spot. Bow hugs the LEFT ear/horn/side, flower the RIGHT, and the party-hat
       brim rides each head's top contour. Brims always stay above the eyes
       (y≈168) and mouth (y≈196). Scarf is untouched above. ---- */
    /* bow knot anchor [x, y] — set at each head's left edge / ear-horn base */
    var BOW_AT    = { bunny: [116, 128], cat: [100, 140], bear: [102, 142], dragon: [112, 138], penguin: [98, 150], octo: [80, 150] };
    /* flower centre anchor [x, y] — mirror of the bow, on the right side */
    var FLOWER_AT = { bunny: [204, 128], cat: [220, 140], bear: [218, 142], dragon: [208, 138], penguin: [222, 150], octo: [236, 150] };
    /* party hat per crown: [brimLeftX, brimY, brimWidth, apexY] */
    var HAT_AT = {
      bunny:   [130, 112, 60,  52],   /* nestled between the two tall ears */
      cat:     [128, 116, 64,  50],   /* in the notch between the pointy ears */
      bear:    [125, 116, 70,  52],   /* between the round ear circles */
      dragon:  [125, 116, 70,  50],   /* between the two horns */
      penguin: [122, 108, 76,  46],   /* perched on the bare round crown */
      octo:    [105, 92,  110, 30]    /* riding the big bulbous head */
    };

    /* ---- BOW: ribbon tucked by the left ear / horn / side of head ---- */
    if (extra === "bow") {
      var ba = BOW_AT[creature] || BOW_AT.bunny;
      return '<g transform="translate(' + ba[0] + " " + ba[1] + ')">'
        + '<path d="M0 0 L-30 -16 Q-33 0 -30 16 Z" fill="' + accent + '"/>'           /* left loop, notched inner edge */
        + '<path d="M0 0 L30 -16 Q33 0 30 16 Z" fill="' + accent + '"/>'              /* right loop */
        + '<path d="M-4 6 L-12 26 L3 18 Z" fill="' + shade(accent, 0.1) + '"/>'       /* left tail */
        + '<path d="M4 6 L12 26 L-3 18 Z" fill="' + shade(accent, 0.1) + '"/>'        /* right tail */
        + '<ellipse cx="0" cy="0" rx="7" ry="9" fill="' + aDark + '"/>'               /* knot */
        + '<path d="M-7 -2 Q0 5 7 -2" stroke="' + aDeep + '" stroke-width="1.4" fill="none"/>'  /* knot wrap */
        + "</g>";
    }
    /* ---- FLOWER: 5-petal bloom tucked by the right ear / horn / side of head ---- */
    if (extra === "flower") {
      var fa = FLOWER_AT[creature] || FLOWER_AT.bunny;
      var p = '<g transform="translate(' + fa[0] + " " + fa[1] + ')">';
      var degs = [0, 72, 144, 216, 288];
      for (var i = 0; i < degs.length; i++) {
        p += '<ellipse cx="0" cy="-13" rx="8" ry="12" fill="' + accent + '" transform="rotate(' + degs[i] + ')"/>';
      }
      p += '<path d="M12 5 Q24 7 22 17 Q13 13 12 5 Z" fill="#8FD8B6"/>'              /* little leaf */
        + '<circle cx="0" cy="0" r="7" fill="#FFE27A"/>'                              /* pollen centre */
        + '<circle cx="-2" cy="-2" r="2.6" fill="#fff" opacity=".7"/>'                /* shine */
        + "</g>";
      return p;
    }
    /* ---- PARTY HAT: cone whose brim rides each creature's head/top contour ---- */
    if (extra === "hat") {
      var ha = HAT_AT[creature] || HAT_AT.bunny;
      var bx = ha[0], by = ha[1], bw = ha[2], ay = ha[3];
      var cx = 160;                              /* head centre */
      var baseY = by + 4;                        /* cone base sits just under the brim */
      var baseL = bx + 6, baseR = bx + bw - 6;   /* cone base inset from the brim ends */
      /* tapered stripe band ~52–64% down the cone, following its taper */
      var f1 = 0.52, f2 = 0.64;
      var y1 = ay + (baseY - ay) * f1, y2 = ay + (baseY - ay) * f2;
      var hw1 = (baseR - baseL) / 2 * f1, hw2 = (baseR - baseL) / 2 * f2;
      return ""
        + '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="13" rx="6" fill="' + aDark + '"/>'                 /* brim on the crown */
        + '<path d="M' + baseL + " " + baseY + " L" + cx + " " + ay + " L" + baseR + " " + baseY + ' Z" fill="' + accent + '"/>'  /* cone */
        + '<path d="M' + (cx - hw2) + " " + y2 + " L" + (cx + hw2) + " " + y2 + " L" + (cx + hw1) + " " + y1 + " L" + (cx - hw1) + " " + y1 + ' Z" fill="' + shade(accent, 0.15) + '" opacity=".7"/>'  /* stripe */
        + '<circle cx="' + cx + '" cy="' + (ay - 2) + '" r="9" fill="#FFE27A"/>'                                             /* pom */
        + '<circle cx="' + (cx - 2) + '" cy="' + (ay - 4) + '" r="3" fill="#fff" opacity=".75"/>';                           /* pom shine */
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
      + extraParts(state.extra, accent, state.creature)
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
    if (state.face === "love") bonus += 2;
    if (state.face === "wink") bonus += 1;
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

  function faceEmoji(id) {
    return ({ happy: "😄", sleepy: "😴", cheeky: "😜", surprised: "😮", calm: "🙂",
              love: "🥰", wink: "😉", smug: "😏" })[id] || "😊";
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
    var nm = (state.name && state.name.trim()) || "your friend";
    var fileNm = (state.name && state.name.trim()) || "my-stuffy";
    var body = colorById(state.body).hex;
    var accent = colorById(state.accent).hex;

    /* the stuffy itself, drawn in its native 320×320 space */
    var artInner = ground()
      + creatureBody(state.creature, body, accent)
      + extraParts(state.extra, accent, state.creature)
      + faceParts(state.face, state.creature);

    /* detail rows that mirror the on-page collectible card */
    var details = [
      ["creature", creatureById(state.creature).name],
      ["yarn", colorById(state.body).name],
      ["accent", colorById(state.accent).name],
      ["mood", faceById(state.face).name],
      ["extra", extraById(state.extra).name],
      ["cuddle", cuddleScore() + "/10"]
    ];
    function row(label, value, y) {
      return '<text x="650" y="' + y + '" font-family="Nunito, sans-serif" font-size="24" fill="#4A3B6B">'
        + '<tspan font-family="Fredoka, sans-serif" font-weight="600" fill="#7B4FC4">' + escapeXml(label) + ":</tspan> "
        + escapeXml(value) + "</text>";
    }
    var rowsSvg = "";
    for (var i = 0; i < details.length; i++) {
      rowsSvg += row(details[i][0], details[i][1], 258 + i * 44);
    }

    var fullSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="2000" height="1400">'
      + '<defs><linearGradient id="cardbg" x1="0" y1="0" x2="1" y2="1">'
      + '<stop offset="0" stop-color="#EFE3FB"/><stop offset="1" stop-color="#FFF0F6"/>'
      + "</linearGradient></defs>"
      /* background + dashed border, matching the on-page .ws-card look */
      + '<rect width="1000" height="700" fill="url(#cardbg)"/>'
      + '<rect x="18" y="18" width="964" height="664" rx="36" fill="none" stroke="#7B4FC4" stroke-width="4" stroke-dasharray="14 12"/>'
      /* top banner */
      + '<text x="500" y="52" text-anchor="middle" font-family="Fredoka, sans-serif" font-size="26" font-weight="600" fill="#7B4FC4">🍀 Purple Clover Workshop</text>'
      /* art panel — paper background, scaled up so every stitch stays visible */
      + '<rect x="48" y="84" width="560" height="560" rx="24" fill="#FFFDF7" stroke="#4A3B6B" stroke-width="3"/>'
      + '<g transform="translate(72 108) scale(1.6)">' + artInner + "</g>"
      /* name + tagline */
      + '<text x="650" y="148" font-family="Fredoka, sans-serif" font-size="44" font-weight="700" fill="#7B4FC4">' + escapeXml(nm) + "</text>"
      + '<text x="650" y="190" font-family="Nunito, sans-serif" font-size="22" font-style="italic" fill="#6E5E94">' + escapeXml(taglineFor()) + "</text>"
      + '<line x1="650" y1="212" x2="952" y2="212" stroke="#C9A6F0" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round"/>'
      /* detail rows */
      + rowsSvg
      /* made-for footer — wrapped across lines so the whole phrase fits the
         1000×700 card even with an 18-char name (right column is only ~300px). */
      + '<text font-family="Nunito, sans-serif" font-size="15" fill="#6E5E94">'
      + '<tspan x="650" y="584">made for ' + escapeXml(nm) + '</tspan>'
      + '<tspan x="650" y="607">with yarn &amp; love at the</tspan>'
      + '<tspan x="650" y="630">Purple Clover Workshop 🍀</tspan>'
      + '</text>'
      + "</svg>";

    try {
      var blob = new Blob([fullSvg], { type: "image/svg+xml" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = fileNm.toLowerCase().replace(/\s+/g, "-") + "-stuffy.svg";
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
