/**
 * ============================================================
 *  Chindhamani Healthcare and Laboratories — script.js
 *  Vanilla JavaScript (ES6+). No frameworks, no dependencies.
 *  ------------------------------------------------------------
 *  1.  Clinic constants
 *  2.  Small DOM helpers
 *  3.  Footer year
 *  4.  Sticky header state
 *  5.  Mobile navigation drawer
 *  6.  Active navigation link (scroll spy)
 *  7.  Scroll reveal animations
 *  8.  Back-to-top button
 *  9.  WhatsApp enquiry links
 * 10.  Email links (Gmail compose + mailto fallback)
 * 11.  Contact form validation → WhatsApp enquiry
 * ============================================================
 */
(function () {
  "use strict";

  /* ---------- 1. Clinic constants ---------- */
  const CLINIC = {
    whatsappNumber: "918438425206",
    gmailCompose:
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      encodeURIComponent("chindhacare24@gmail.com"),
    mailto: "mailto:chindhacare24@gmail.com"
  };

  const DEFAULT_WHATSAPP_MESSAGE =
    "Hi, I would like to enquire about booking an appointment at Chindhamani Healthcare and Laboratories.";

  const NAV_BREAKPOINT = 992;

  /* ---------- 2. Small DOM helpers ---------- */
  const qs = (selector, scope) => (scope || document).querySelector(selector);
  const qsa = (selector, scope) =>
    Array.prototype.slice.call((scope || document).querySelectorAll(selector));

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const buildWhatsAppURL = (message) =>
    "https://wa.me/" +
    CLINIC.whatsappNumber +
    "?text=" +
    encodeURIComponent(message || DEFAULT_WHATSAPP_MESSAGE);

  /* ---------- 3. Footer year ---------- */
  function setCurrentYear() {
    const yearNode = qs("#currentYear");
    if (yearNode) {
      yearNode.textContent = String(new Date().getFullYear());
    }
  }

  /* ---------- 4. Sticky header state ---------- */
  function initHeaderState() {
    const header = qs("#siteHeader");
    if (!header) return;

    const update = () => {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- 5. Mobile navigation drawer ---------- */
  function initNavigation() {
    const nav = qs("#primaryNav");
    const toggle = qs("#navToggle");
    const backdrop = qs("#navBackdrop");
    if (!nav || !toggle) return;

    const isOpen = () => nav.classList.contains("is-open");

    const open = () => {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
      if (backdrop) {
        backdrop.hidden = false;
        window.requestAnimationFrame(() => backdrop.classList.add("is-open"));
      }
    };

    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
      if (backdrop) {
        backdrop.classList.remove("is-open");
        window.setTimeout(() => {
          if (!isOpen()) backdrop.hidden = true;
        }, 350);
      }
    };

    toggle.addEventListener("click", () => {
      if (isOpen()) close();
      else open();
    });

    if (backdrop) {
      backdrop.addEventListener("click", close);
    }

    // Close after choosing a destination
    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        if (isOpen()) close();
      });
    });

    // Keyboard support
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        close();
        toggle.focus();
      }
    });

    // Reset when growing past the breakpoint
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (window.innerWidth > NAV_BREAKPOINT && isOpen()) close();
      }, 150);
    });
  }

  /* ---------- 6. Active navigation link ---------- */
  function initScrollSpy() {
    const links = qsa(".nav__link");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      const section = qs(id);
      if (section) map.set(section, link);
    });

    const setActive = (activeLink) => {
      links.forEach((link) => link.classList.toggle("is-active", link === activeLink));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const link = map.get(entry.target);
          if (link) setActive(link);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    map.forEach((link, section) => observer.observe(section));
  }

  /* ---------- 7. Scroll reveal ---------- */
  function initReveal() {
    const items = qsa(".reveal");
    if (!items.length) return;

    const applyDelay = (item) => {
      const delay = Number(item.getAttribute("data-delay"));
      if (delay > 0) item.style.setProperty("--reveal-delay", delay + "ms");
    };

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          applyDelay(entry.target);
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  }

  /* ---------- 8. Back to top ---------- */
  function initBackToTop() {
    const button = qs("#backToTop");
    if (!button) return;

    const update = () => {
      button.classList.toggle("is-visible", window.scrollY > 520);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
    });
  }

  /* ---------- 9. WhatsApp enquiry links ---------- */
  function initWhatsAppLinks() {
    const links = qsa(".js-whatsapp");
    if (!links.length) return;

    links.forEach((link) => {
      const custom = link.getAttribute("data-message");
      const url = buildWhatsAppURL(custom);

      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");

      // Keep native target=_blank behavior so popup protection never
      // redirects or reloads the clinic page.
    });
  }

  /* ---------- 10. Email links ---------- */
  function initEmailLinks() {
    const links = qsa(".js-email");
    if (!links.length) return;

    links.forEach((link) => {
      const composeURL = link.getAttribute("href") || CLINIC.gmailCompose;
      const mailtoURL = link.getAttribute("data-mailto") || CLINIC.mailto;

      link.setAttribute("href", composeURL);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");

      // Gmail opens in a separate tab. The separate mailto link remains
      // the explicit fallback for visitors who prefer their mail app.
    });
  }

  /* ---------- 11. Contact form ---------- */
  const FIELD_RULES = {
    fullName: {
      message: "Please enter your full name.",
      validate: (value) => value.trim().length >= 2
    },
    phone: {
      message: "Please enter a valid 10-digit mobile number.",
      validate: (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length === 10 || (digits.length > 10 && digits.length <= 13);
      }
    },
    email: {
      message: "Please enter a valid email address.",
      validate: (value) =>
        value.trim() === "" || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim())
    },
    message: {
      message: "Please tell us briefly what you would like to enquire about.",
      validate: (value) => value.trim().length >= 5
    }
  };

  function setFieldError(input, message) {
    const field = input.closest(".form__field");
    const errorNode = qs("#" + input.id + "Error");

    if (message) {
      if (field) field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      if (errorNode) {
        errorNode.textContent = message;
        errorNode.hidden = false;
      }
    } else {
      if (field) field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      if (errorNode) {
        errorNode.textContent = "";
        errorNode.hidden = true;
      }
    }
  }

  function validateField(input) {
    const rule = FIELD_RULES[input.id];
    if (!rule) return true;

    const valid = rule.validate(input.value);
    setFieldError(input, valid ? "" : rule.message);
    return valid;
  }

  function buildEnquiryMessage(values) {
    const lines = [
      "Hi, I would like to enquire about an appointment at Chindhamani Healthcare and Laboratories.",
      "",
      "Name: " + values.fullName,
      "Phone: " + values.phone
    ];

    if (values.email) lines.push("Email: " + values.email);
    lines.push("", "Message: " + values.message);

    return lines.join("\n");
  }

  function initContactForm() {
    const form = qs("#enquiryForm");
    if (!form) return;

    const status = qs("#formStatus");
    const inputs = qsa("input, textarea", form).filter((el) => FIELD_RULES[el.id]);

    inputs.forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validateField(input);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      inputs.forEach((input) => {
        const valid = validateField(input);
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        if (status) {
          status.textContent = "Please correct the highlighted fields and try again.";
        }
        firstInvalid.focus();
        return;
      }

      const values = {};
      inputs.forEach((input) => {
        values[input.id] = input.value.trim();
      });

      const url = buildWhatsAppURL(buildEnquiryMessage(values));
      const opened = window.open(url, "_blank", "noopener");

      if (opened) {
        if (status) {
          status.textContent =
            "Thank you, " +
            values.fullName +
            ". WhatsApp is opening with your enquiry — press send there to reach us.";
        }
        form.reset();
      } else if (status) {
        status.textContent =
          "Your browser blocked the new tab. Allow pop-ups for this site, then submit your enquiry again.";
      }
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    setCurrentYear();
    initHeaderState();
    initNavigation();
    initScrollSpy();
    initReveal();
    initBackToTop();
    initWhatsAppLinks();
    initEmailLinks();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
