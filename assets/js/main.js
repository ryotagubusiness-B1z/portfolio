/* ============================================================================
   Forgé — interaction layer
   Vanilla, dependency-free. rAF-throttled. Honours prefers-reduced-motion.
   Motion should read as a consequence of intent, never decoration.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---- current year ----------------------------------------------------- */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- scroll reveal ---------------------------------------------------- */
  const reveals = $$("[data-reveal]");
  if (reduced) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---- single rAF loop drives parallax + progress ----------------------- */
  const parallax = $$("[data-parallax]").map((el) => ({
    el,
    rate: parseFloat(el.getAttribute("data-parallax")) || 0.1,
  }));
  const bar = $(".progress");
  // only the transparent (hero) nav needs the scrolled state; inner pages are solid
  const nav = $(".nav:not(.nav--solid)");
  let ticking = false;

  const frame = () => {
    const vh = window.innerHeight;
    const doc = document.documentElement;

    if (nav) nav.classList.toggle("is-scrolled", doc.scrollTop > 60);

    if (!reduced) {
      for (const p of parallax) {
        const r = p.el.getBoundingClientRect();
        // distance of element centre from viewport centre, normalised
        const offset = (r.top + r.height / 2 - vh / 2) / vh;
        const shift = -(offset * p.rate * vh).toFixed(2);
        p.el.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
    }

    if (bar) {
      const max = doc.scrollHeight - vh;
      const prog = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${prog.toFixed(4)})`;
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  frame();

  /* ---- magnetic feel on primary links (cursor-aware, subtle) ------------ */
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    $$(".feature__link, .nav__links a, .contact__mail").forEach((el) => {
      el.style.transition = "transform .4s cubic-bezier(.16,1,.3,1)";
      el.addEventListener("pointermove", (ev) => {
        const r = el.getBoundingClientRect();
        const mx = (ev.clientX - r.left - r.width / 2) / r.width;
        const my = (ev.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${(mx * 6).toFixed(2)}px, ${(my * 5).toFixed(2)}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---- in-page anchor: respect reduced motion --------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });
})();
