const REGISTRATION_STATE_KEY = "sf_nusp_registrations_open";

function readRegistrationState() {
  try {
    const storedValue = window.localStorage.getItem(REGISTRATION_STATE_KEY);
    return storedValue === null ? true : storedValue === "true";
  } catch {
    return true;
  }
}

const REGISTRATIONS_OPEN = readRegistrationState();
// When true: show form. When false: show closed message.

const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

window.addEventListener("load", () => {
  body.classList.add("is-loaded");
});

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    });
  });
}

const joinForm = document.querySelector("[data-join-form]");
const joinSuccess = document.querySelector("[data-join-success]");

if (joinForm && joinSuccess) {
  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    joinForm.hidden = true;
    joinSuccess.hidden = false;
  });
}

const registerForm = document.querySelector("[data-register-form]");
const registerSuccess = document.querySelector("[data-register-success]");
const registerOpenState = document.querySelector("[data-register-open]");
const registerClosedState = document.querySelector("[data-register-closed]");

if (registerOpenState && registerClosedState) {
  registerOpenState.hidden = !REGISTRATIONS_OPEN;
  registerClosedState.hidden = REGISTRATIONS_OPEN;
}

if (registerForm && registerSuccess) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registerForm.hidden = true;
    registerSuccess.hidden = false;
  });
}

function updateHeaderScrollState() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 50);
}

window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
updateHeaderScrollState();

function ensureBubbleFilter() {
  if (document.querySelector("#goo-button-filter")) {
    return;
  }

  const filterSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  filterSvg.setAttribute("class", "goo");
  filterSvg.setAttribute("aria-hidden", "true");
  filterSvg.innerHTML = `
    <defs>
      <filter id="goo-button-filter">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"></feColorMatrix>
        <feComposite in="SourceGraphic" in2="goo"></feComposite>
      </filter>
    </defs>
  `;
  document.body.append(filterSvg);
}

function setupBubbleButtons() {
  const bubbleButtons = document.querySelectorAll("[data-bubble-button]");

  if (!bubbleButtons.length) {
    return;
  }

  ensureBubbleFilter();

  bubbleButtons.forEach((button) => {
    if (button.parentElement?.classList.contains("button--bubble__container")) {
      return;
    }

    button.classList.add("button--bubble");

    const container = document.createElement("span");
    container.className = "button--bubble__container";

    const effectContainer = document.createElement("span");
    effectContainer.className = "button--bubble__effect-container";
    effectContainer.setAttribute("aria-hidden", "true");
    effectContainer.innerHTML = `
      <span class="button--bubble__circle top-left top-left-1"></span>
      <span class="button--bubble__circle top-left top-left-2"></span>
      <span class="button--bubble__circle top-left top-left-3"></span>
      <span class="button--bubble__circle bottom-right bottom-right-1"></span>
      <span class="button--bubble__circle bottom-right bottom-right-2"></span>
      <span class="button--bubble__circle bottom-right bottom-right-3"></span>
    `;

    button.parentNode.insertBefore(container, button);
    container.append(button, effectContainer);

    let animationTimer;

    const playBubbleAnimation = () => {
      window.clearTimeout(animationTimer);
      container.classList.remove("is-animating");
      void container.offsetWidth;
      container.classList.add("is-animating");
      animationTimer = window.setTimeout(() => {
        container.classList.remove("is-animating");
      }, 950);
    };

    button.addEventListener("mouseenter", playBubbleAnimation);
    button.addEventListener("focus", playBubbleAnimation);
  });
}

setupBubbleButtons();

function setupScrollReveal() {
  const revealTargets = document.querySelectorAll(
    "main > section, main .section-frame, main .join-hero, main .join-form-wrap, main .content-card, main .join-form-card, main .join-success-card"
  );

  if (!revealTargets.length) {
    return;
  }

  revealTargets.forEach((target) => {
    target.classList.add("reveal-section");
  });

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
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((target) => {
    observer.observe(target);
  });
}

setupScrollReveal();

function setupFloatingWhatsAppButton() {
  if (document.querySelector(".floating-whatsapp")) {
    return;
  }

  const floatingButton = document.createElement("a");
  floatingButton.className = "floating-whatsapp";
  floatingButton.href = "https://whatsapp.com/channel/0029VbBBjk7HwXbG065Qnd0e";
  floatingButton.target = "_blank";
  floatingButton.rel = "noopener noreferrer";
  floatingButton.setAttribute("aria-label", "Chat with us on WhatsApp");
  floatingButton.innerHTML = `
    <span class="floating-whatsapp__icon" aria-hidden="true">💬</span>
    <span class="floating-whatsapp__tooltip">Chat with us</span>
  `;

  document.body.append(floatingButton);
}

setupFloatingWhatsAppButton();

// FAQ Accordion Toggle
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const panel = item.querySelector(".faq-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      
      // Close all other panels
      faqItems.forEach((otherItem) => {
        const otherTrigger = otherItem.querySelector(".faq-trigger");
        const otherPanel = otherItem.querySelector(".faq-panel");
        if (otherTrigger && otherPanel && otherItem !== item) {
          otherTrigger.setAttribute("aria-expanded", "false");
          otherPanel.classList.remove("is-active");
          const otherIcon = otherTrigger.querySelector(".faq-icon");
          if (otherIcon) otherIcon.textContent = "+";
        }
      });

      // Toggle current panel
      trigger.setAttribute("aria-expanded", String(!isExpanded));
      panel.classList.toggle("is-active", !isExpanded);
      const icon = trigger.querySelector(".faq-icon");
      if (icon) icon.textContent = isExpanded ? "+" : "−";
    });
  });
}
setupFaqAccordion();

// ─── Event Countdown (admin-controlled 3-mode system) ───────────────────────
const EVENT_MODE_KEY  = "sf_nusp_event_mode";   // "closed" | "date_soon" | "countdown"
const EVENT_DATE_KEY  = "sf_nusp_event_date";   // ISO date-time string

function readEventMode() {
  try { return localStorage.getItem(EVENT_MODE_KEY) || "countdown"; } catch { return "countdown"; }
}

function readEventDate() {
  try { return localStorage.getItem(EVENT_DATE_KEY) || "2026-10-17T09:00:00"; } catch { return "2026-10-17T09:00:00"; }
}

function setupEventCountdown() {
  const region = document.getElementById("event-countdown-region");
  if (!region) return;

  const mode = readEventMode();

  if (mode === "closed") {
    region.innerHTML = `
      <div class="event-state-banner event-state-closed">
        <span class="event-state-icon">🔒</span>
        <p class="event-state-title">Registrations Closed</p>
        <p class="event-state-sub">Registration for this event has ended. Stay tuned for future events.</p>
      </div>`;
    return;
  }

  if (mode === "date_soon") {
    region.innerHTML = `
      <div class="event-state-banner event-state-soon">
        <span class="event-state-icon">📅</span>
        <p class="event-state-title">Date Reveal Soon</p>
        <p class="event-state-sub">We're finalising the date — check back soon!</p>
      </div>`;
    return;
  }

  // mode === "countdown" — render live timer
  const dateStr = readEventDate();
  const targetTime = new Date(dateStr).getTime();

  region.innerHTML = `
    <p class="countdown-title">TIME REMAINING TO REGISTER</p>
    <div class="countdown-timer" id="countdown">
      <div class="countdown-item"><span class="countdown-number" id="days">00</span><span class="countdown-label">Days</span></div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item"><span class="countdown-number" id="hours">00</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item"><span class="countdown-number" id="minutes">00</span><span class="countdown-label">Mins</span></div>
      <div class="countdown-separator">:</div>
      <div class="countdown-item"><span class="countdown-number" id="seconds">00</span><span class="countdown-label">Secs</span></div>
    </div>`;

  const daysEl    = document.getElementById("days");
  const hoursEl   = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function tick() {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      [daysEl, hoursEl, minutesEl, secondsEl].forEach(el => { if (el) el.textContent = "00"; });
      return;
    }
    if (daysEl)    daysEl.textContent    = String(Math.floor(diff / 86400000)).padStart(2, "0");
    if (hoursEl)   hoursEl.textContent   = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  }

  tick();
  const timer = setInterval(tick, 1000);
}

// setupEventCountdown();


// ─── Moments Lightbox Gallery ────────────────────────────────────────────────
function setupMomentsGallery() {
  const photoBoxes = document.querySelectorAll(".photo-box");
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");

  if (!photoBoxes.length || !modal || !modalImg || !closeBtn) {
    return;
  }

  // Helper to open modal
  function openLightbox(imgSrc, imgAlt) {
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt || "Enlarged moment";
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    
    // Set focus on close button for accessibility
    closeBtn.focus();
  }

  // Helper to close modal
  function closeLightbox() {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    
    // Clear image source after transition finishes to avoid flash next time
    setTimeout(() => {
      if (!modal.classList.contains("is-active")) {
        modalImg.src = "";
      }
    }, 300);
  }

  // Attach click listeners to all photo boxes
  photoBoxes.forEach((box) => {
    const img = box.querySelector("img");
    if (!img) return;

    box.addEventListener("click", () => {
      openLightbox(img.src, img.alt);
    });

    // Make interactive via keyboard (Enter/Space)
    box.setAttribute("tabindex", "0");
    box.setAttribute("role", "button");
    box.setAttribute("aria-label", "View larger moment photo");

    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  // Close triggers
  closeBtn.addEventListener("click", closeLightbox);
  
  modal.addEventListener("click", (e) => {
    // If clicked the background overlay itself (not the image or content wrapper)
    if (e.target === modal || e.target.classList.contains("lightbox-content")) {
      closeLightbox();
    }
  });

  // Escape key support
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeLightbox();
    }
  });
}

setupMomentsGallery();



