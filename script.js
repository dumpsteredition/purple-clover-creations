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
