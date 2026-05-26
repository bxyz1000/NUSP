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
