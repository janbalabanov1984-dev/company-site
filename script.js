// XcoudLabs front-end interactions
// - Smooth scroll navigation
// - Mobile navigation toggle
// - FAQ accordion
// - Scroll-based reveal animations
// - Contact form validation
// - Small button & CTA interactions

document.addEventListener("DOMContentLoaded", () => {
  initCurrentYear();
  initSmoothScroll();
  initNavToggle();
  initFaq();
  initRevealOnScroll();
  initContactForm();
  initCtaCopyEmail();
});

function initCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

// ========== SMOOTH SCROLL NAVIGATION ==========

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 0;
      const rect = target.getBoundingClientRect();
      const offset = rect.top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    });
  });
}

// ========== MOBILE NAV TOGGLE ==========

function initNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  // Close nav when clicking a link (mobile)
  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.tagName === "A") {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ========== FAQ ACCORDION ==========

function initFaq() {
  const triggers = document.querySelectorAll(".faq-trigger");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panelId = trigger.getAttribute("aria-controls");
      if (!panelId) return;

      const panel = document.getElementById(panelId);
      if (!panel) return;

      // Close all others
      closeAllFaqItems(trigger);

      // Toggle current
      trigger.setAttribute("aria-expanded", String(!expanded));
      panel.classList.toggle("is-open", !expanded);
      panel.setAttribute("aria-hidden", String(expanded));
    });
  });
}

function closeAllFaqItems(exceptTrigger) {
  const allTriggers = document.querySelectorAll(".faq-trigger");
  const allPanels = document.querySelectorAll(".faq-panel");

  allTriggers.forEach((btn) => {
    if (btn === exceptTrigger) return;
    btn.setAttribute("aria-expanded", "false");
  });

  allPanels.forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  });
}

// ========== SCROLL-BASED REVEAL ==========

function initRevealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// ========== CONTACT FORM VALIDATION ==========

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = [
      { id: "name", required: true },
      { id: "email", required: true, type: "email" },
      { id: "message", required: true },
    ];

    let hasError = false;

    fields.forEach(({ id, required, type }) => {
      const fieldWrapper = form.querySelector(".field #" + id)?.closest(".field");
      const input = form.querySelector("#" + id);
      const errorEl = fieldWrapper ? fieldWrapper.querySelector(".field-error") : null;

      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)) {
        return;
      }

      let errorMessage = "";
      const value = input.value.trim();

      if (required && !value) {
        errorMessage = "This field is required.";
      } else if (type === "email" && value && !isValidEmail(value)) {
        errorMessage = "Please enter a valid email address.";
      }

      if (errorMessage) {
        hasError = true;
        fieldWrapper && fieldWrapper.classList.add("field--error");
        if (errorEl) errorEl.textContent = errorMessage;
      } else {
        fieldWrapper && fieldWrapper.classList.remove("field--error");
        if (errorEl) errorEl.textContent = "";
      }
    });

    if (statusEl instanceof HTMLElement) {
      statusEl.textContent = "";
      statusEl.classList.remove("form-status--error", "form-status--success");
    }

    if (hasError) {
      if (statusEl instanceof HTMLElement) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.classList.add("form-status--error");
      }
      return;
    }

    // For this static site we just show a fake success state
    form.reset();
    if (statusEl instanceof HTMLElement) {
      statusEl.textContent = "Message sent. We’ll get back to you shortly.";
      statusEl.classList.add("form-status--success");
    }
  });
}

function isValidEmail(email) {
  // Simple, lightweight email pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== CTA EMAIL COPY ==========

function initCtaCopyEmail() {
  const btn = document.getElementById("cta-email-btn");
  if (!btn) return;

  const email = "hello@xcoudlabs.ai";

  btn.addEventListener("click", async () => {
    let copied = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      // Fallback: select a temp input
      const tempInput = document.createElement("input");
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand("copy");
        copied = true;
      } catch {
        copied = false;
      }
      document.body.removeChild(tempInput);
    }

    const originalText = btn.textContent || "Copy email";
    btn.textContent = copied ? "Email copied" : email;
    btn.classList.add("btn-primary");

    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove("btn-primary");
    }, 2200);
  });
}