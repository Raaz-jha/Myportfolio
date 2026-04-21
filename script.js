const contactForm = document.getElementById("contact-form");
const successPopup = document.getElementById("success-popup");
const closePopupButton = document.getElementById("close-popup");
const resumeButton = document.querySelector(".resume-button");
const profileImage = document.getElementById("profile-image");
const imagePopup = document.getElementById("image-popup");
const closeImagePopupButton = document.getElementById("close-image-popup");
const fadeElements = document.querySelectorAll(".fade-in");
const navPill = document.getElementById("nav-pill");
const heroRoleDynamic = document.getElementById("hero-role-dynamic");
const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = navPill ? navPill.querySelectorAll("a") : [];

if (themeToggle) {
    const savedTheme = window.localStorage.getItem("theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    let currentTheme = savedTheme || preferredTheme;

    const applyTheme = (theme) => {
        document.body.setAttribute("data-theme", theme);
    };

    applyTheme(currentTheme);

    themeToggle.addEventListener("click", () => {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(currentTheme);
        window.localStorage.setItem("theme", currentTheme);
    });
}

if (heroRoleDynamic) {
    const rolePhrases = ["CSIT Student.", "Frontend Developer."];
    let phraseIndex = 0;
    let roleTimer;

    const triggerRolePop = () => {
        heroRoleDynamic.classList.remove("fade-out");
        heroRoleDynamic.classList.remove("pop");
        void heroRoleDynamic.offsetWidth;
        requestAnimationFrame(() => {
            heroRoleDynamic.classList.add("pop");
        });
    };

    const triggerRoleFadeOut = () => {
        heroRoleDynamic.classList.remove("pop");
        heroRoleDynamic.classList.remove("fade-out");
        void heroRoleDynamic.offsetWidth;
        requestAnimationFrame(() => {
            heroRoleDynamic.classList.add("fade-out");
        });
    };

    const showRole = () => {
        heroRoleDynamic.textContent = rolePhrases[phraseIndex];
        triggerRolePop();
        phraseIndex = (phraseIndex + 1) % rolePhrases.length;

        window.clearTimeout(roleTimer);
        roleTimer = window.setTimeout(() => {
            triggerRoleFadeOut();
        }, 1500);
    };

    showRole();
    window.setInterval(showRole, 2200);
}

if (navPill) {
    const updateNavPillState = () => {
        if (window.scrollY > 10) {
            navPill.classList.add("scrolled");
        } else {
            navPill.classList.remove("scrolled");
        }
    };

    updateNavPillState();
    window.addEventListener("scroll", updateNavPillState, { passive: true });
}

if (menuToggle && navPill) {
    const closeMobileMenu = () => {
        navPill.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = navPill.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 700) {
                closeMobileMenu();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (window.innerWidth <= 700 && !navPill.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.18) {
                entry.target.classList.add("show");
            } else if (entry.intersectionRatio < 0.03) {
                entry.target.classList.remove("show");
            }
        });
    }, {
        threshold: [0, 0.03, 0.18, 0.35]
    });

    fadeElements.forEach((element) => {
        fadeObserver.observe(element);
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");
        const formData = new FormData(contactForm);

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Message send failed");
            }

            contactForm.reset();

            if (successPopup) {
                successPopup.classList.add("show");
            }
        } catch (error) {
            alert("Message could not be sent. Please try again.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        }
    });
}

if (closePopupButton && successPopup) {
    closePopupButton.addEventListener("click", () => {
        successPopup.classList.remove("show");
    });

    successPopup.addEventListener("click", (event) => {
        if (event.target === successPopup) {
            successPopup.classList.remove("show");
        }
    });
}

if (resumeButton) {
    resumeButton.addEventListener("click", () => {
        resumeButton.classList.remove("downloading");

        requestAnimationFrame(() => {
            resumeButton.classList.add("downloading");
        });

        window.setTimeout(() => {
            resumeButton.classList.remove("downloading");
        }, 800);
    });
}

if (profileImage && imagePopup) {
    profileImage.addEventListener("click", () => {
        imagePopup.classList.add("show");
    });
}

if (closeImagePopupButton && imagePopup) {
    closeImagePopupButton.addEventListener("click", () => {
        imagePopup.classList.remove("show");
    });

    imagePopup.addEventListener("click", (event) => {
        if (event.target === imagePopup) {
            imagePopup.classList.remove("show");
        }
    });
}
