(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // current year in the footer
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // dark mode toggle
  const themeBtn = $(".nav__theme");
  const root = document.documentElement;
  if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", "light");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  // mobile hamburger menu
  const burger = $(".nav__burger");
  const mobileMenu = $("#mobile-menu");
  if (burger && mobileMenu) {
    const openMenu = () => {
      burger.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add("is-open");
      mobileMenu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeMenu = () => {
      burger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    burger.addEventListener("click", () => {
      burger.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
    });
    $$(".mobile-menu nav a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) closeMenu();
    });
  }

  // reveal elements as they scroll into view
  const reveals = $$("[data-reveal]");
  if (reduced) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  // one rAF loop for parallax + scroll progress bar
  const parallax = $$("[data-parallax]").map((el) => ({
    el,
    rate: parseFloat(el.getAttribute("data-parallax")) || 0.1,
  }));
  const bar = $(".progress");
  let ticking = false;

  const frame = () => {
    const vh = window.innerHeight;
    const doc = document.documentElement;

    if (!reduced) {
      for (const p of parallax) {
        const rect = p.el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const shift = -(offset * p.rate * vh).toFixed(2);
        p.el.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
    }

    if (bar) {
      const max = doc.scrollHeight - vh;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
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

  // subtle magnetic hover on key links (fine pointers only)
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    $$(".feature__link, .nav__links a, .contact__mail").forEach((el) => {
      el.style.transition = "transform .4s cubic-bezier(.16,1,.3,1)";
      el.addEventListener("pointermove", (ev) => {
        const rect = el.getBoundingClientRect();
        const mx = (ev.clientX - rect.left - rect.width / 2) / rect.width;
        const my = (ev.clientY - rect.top - rect.height / 2) / rect.height;
        el.style.transform = `translate(${(mx * 6).toFixed(2)}px, ${(my * 5).toFixed(2)}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0,0)";
      });
    });
  }

  // smooth in-page anchors
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      history.pushState(null, "", id);
    });
  });

  // discourage casual copying / source peeking
  const stop = (e) => {
    e.preventDefault();
    return false;
  };
  ["contextmenu", "copy", "cut", "selectstart", "dragstart"].forEach((ev) =>
    document.addEventListener(ev, stop),
  );
  document.addEventListener("keydown", (e) => {
    const k = (e.key || "").toLowerCase();
    if (e.key === "F12") return stop(e);
    if (
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      (k === "u" || k === "s" || k === "c")
    )
      return stop(e);
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      (k === "i" || k === "j" || k === "c")
    )
      return stop(e);
  });
})();
