const body = document.body;
const menuButton = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const themeButton = document.getElementById("theme-toggle");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const savedTheme = localStorage.getItem("portfolio-theme");
const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

function applyTheme(theme) {
  body.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

applyTheme(initialTheme);

themeButton.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-shell")) {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navAnchors = [...navLinks.querySelectorAll("a")];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navAnchors.forEach((anchor) => {
      const isActive = anchor.getAttribute("href") === `#${entry.target.id}`;
      anchor.classList.toggle("active", isActive);
      if (isActive) anchor.setAttribute("aria-current", "location");
      else anchor.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-30% 0px -60%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const glow = document.querySelector(".cursor-glow");
  if (glow) {
    window.addEventListener("pointermove", (event) => {
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = contactForm.querySelector("button[type='submit']");
  const originalText = button.innerHTML;
  button.disabled = true;
  button.textContent = "Sending…";
  formStatus.textContent = "";

  try {
    const response = await fetch(contactForm.action, { method: "POST", body: new FormData(contactForm) });
    if (!response.ok) throw new Error("Request failed");
    contactForm.reset();
    formStatus.textContent = "Thanks — your message was sent successfully.";
  } catch {
    formStatus.textContent = "The form could not send. Please use the email link instead.";
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
});

const desktopEmailMode = window.matchMedia("(hover: hover) and (pointer: fine)");

document.querySelectorAll("a[href^='mailto:']").forEach((emailLink) => {
  emailLink.addEventListener("click", (event) => {
    if (!desktopEmailMode.matches) return;

    event.preventDefault();
    window.location.hash = "contact";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
