const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    document.documentElement.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor) return;

    const isMobile = window.innerWidth <= 920;
    const hasDropdown = anchor.closest(".site-nav-item[data-dropdown]") && anchor.classList.contains("nav-link-main");

    if (isMobile && hasDropdown) {
      // On mobile, let accordion expand/collapse instead of closing navbar
      return;
    }

    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    document.documentElement.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  });
}

/* ==========================================================================
   MEGA DROPDOWN SCRIPT
   ========================================================================== */

const dropdownItems = document.querySelectorAll(".site-nav-item[data-dropdown]");
let closeTimeout = null;
let activeDropdownItem = null;

// Hover Management (Desktop only)
dropdownItems.forEach((item) => {
  const dropdown = item.querySelector(".mega-dropdown");
  const columns = dropdown.querySelectorAll(".mega-dropdown__item, .mega-dropdown__card");
  const innerElements = dropdown.querySelectorAll(".mega-dropdown__item-title, .mega-dropdown__item-desc, .mega-dropdown__item-link, .mega-dropdown__card-title, .mega-dropdown__card-desc, .mega-dropdown__card-link");

  item.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 920) return; // Ignore on mobile

    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    if (activeDropdownItem === item) return;

    if (activeDropdownItem) {
      // Fast switch: hide active one instantly
      const prevDropdown = activeDropdownItem.querySelector(".mega-dropdown");
      if (prevDropdown) {
        gsap.killTweensOf([prevDropdown, prevDropdown.children]);
        prevDropdown.classList.remove("is-active");
      }
    }

    activeDropdownItem = item;
    dropdown.classList.add("is-active");

    // Play GSAP intro animation (transform y and opacity only)
    gsap.killTweensOf([dropdown, columns, innerElements]);
    
    gsap.fromTo(dropdown,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" }
    );

    gsap.fromTo(columns,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out", stagger: 0.05, delay: 0.05 }
    );

    if (innerElements.length > 0) {
      gsap.fromTo(innerElements,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out", stagger: 0.02, delay: 0.1 }
      );
    }
  });

  item.addEventListener("mouseleave", () => {
    if (window.innerWidth <= 920) return; // Ignore on mobile

    if (closeTimeout) clearTimeout(closeTimeout);

    closeTimeout = setTimeout(() => {
      if (activeDropdownItem) {
        const activeDropdown = activeDropdownItem.querySelector(".mega-dropdown");
        if (activeDropdown) {
          const activeCols = activeDropdown.querySelectorAll(".mega-dropdown__item, .mega-dropdown__card");
          const activeInners = activeDropdown.querySelectorAll(".mega-dropdown__item-title, .mega-dropdown__item-desc, .mega-dropdown__item-link, .mega-dropdown__card-title, .mega-dropdown__card-desc, .mega-dropdown__card-link");
          
          gsap.killTweensOf([activeDropdown, activeCols, activeInners]);
          gsap.to(activeDropdown, {
            opacity: 0,
            y: 12,
            duration: 0.22,
            ease: "power2.inOut",
            onComplete: () => {
              activeDropdown.classList.remove("is-active");
            }
          });
        }
        activeDropdownItem = null;
      }
    }, 150); // Safe threshold to prevent flickering
  });
});

// Mobile Accordion Clicks
dropdownItems.forEach((item) => {
  const mainLink = item.querySelector(".nav-link-main");
  if (mainLink) {
    mainLink.addEventListener("click", (e) => {
      if (window.innerWidth <= 920) {
        e.preventDefault();
        
        // Close others
        dropdownItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("is-expanded");
          }
        });

        // Toggle this one
        item.classList.toggle("is-expanded");
      }
    });
  }
});

const canAnimate = window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canAnimate) {
  gsap.registerPlugin(window.ScrollTrigger);

  gsap.from(".site-header", {
    y: -24,
    opacity: 0,
    duration: 0.75,
    ease: "power3.out"
  });

  // Animate collection page headers
  if (document.querySelector(".collection-header")) {
    gsap.from(".breadcrumbs, .collection-title, .collection-intro", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12
    });
  }

  gsap.from(".hero__kicker, .hero h1, .hero__content-bottom, .hero__image", {
    y: 46,
    opacity: 0,
    duration: 1.05,
    ease: "power3.out",
    stagger: 0.12
  });

  gsap.to(".marquee span", {
    xPercent: -12,
    ease: "none",
    scrollTrigger: {
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.7
    }
  });

  gsap.utils.toArray("section:not(.hero), .project, .editorial-card, .gallery-item, .service-list article, .process-grid article, .values-section article").forEach((element) => {
    gsap.from(element, {
      y: 44,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 86%",
        once: true
      }
    });
  });

  gsap.utils.toArray(".hero__image:not(.hero__slider) img, .project img, .page-hero img, .gallery-item img").forEach((image) => {
    gsap.fromTo(image, {
      scale: 1.08
    }, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8
      }
    });
  });
}

/* ==========================================================================
   HERO SLIDER SCRIPT
   ========================================================================== */

const sliderContainer = document.querySelector(".hero__slider");
if (sliderContainer) {
  const slides = sliderContainer.querySelectorAll(".hero__slide");
  const prevBtn = sliderContainer.querySelector(".hero__slider-arrow--prev");
  const nextBtn = sliderContainer.querySelector(".hero__slider-arrow--next");
  const dots = sliderContainer.querySelectorAll(".hero__slider-dot");
  
  let currentIndex = 0;
  let autoplayTimer = null;
  const autoplayInterval = 5000;
  let isHovered = false;
  let isFocused = false;

  // Initialize and load the first two slides early
  lazyLoadSlide(slides[0]);
  lazyLoadSlide(slides[1]);

  function lazyLoadSlide(slide) {
    if (!slide) return;
    const img = slide.querySelector("img[data-src]");
    if (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
      img.classList.remove("lazy-slide");
    }
  }

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Preload next slide as well for zero-delay transition
    lazyLoadSlide(slides[index]);
    lazyLoadSlide(slides[(index + 1) % slides.length]);

    // Transition slides
    slides[currentIndex].classList.remove("is-active");
    slides[currentIndex].setAttribute("aria-hidden", "true");
    
    slides[index].classList.add("is-active");
    slides[index].removeAttribute("aria-hidden");

    // Transition dots
    dots[currentIndex].classList.remove("is-active");
    dots[currentIndex].setAttribute("aria-selected", "false");
    
    dots[index].classList.add("is-active");
    dots[index].setAttribute("aria-selected", "true");

    currentIndex = index;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isHovered && !isFocused) {
      autoplayTimer = setInterval(nextSlide, autoplayInterval);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Button Click Events
  prevBtn.addEventListener("click", () => {
    prevSlide();
    startAutoplay(); // Restart autoplay timer
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    startAutoplay(); // Restart autoplay timer
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay(); // Restart autoplay timer
    });
  });

  // Pause Autoplay on Hover
  sliderContainer.addEventListener("mouseenter", () => {
    isHovered = true;
    stopAutoplay();
  });

  sliderContainer.addEventListener("mouseleave", () => {
    isHovered = false;
    startAutoplay();
  });

  // Keyboard Accessibility (Left/Right arrow keys)
  sliderContainer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    }
  });

  // Pause Autoplay on Focus
  sliderContainer.addEventListener("focusin", () => {
    isFocused = true;
    stopAutoplay();
  });

  sliderContainer.addEventListener("focusout", () => {
    isFocused = false;
    startAutoplay();
  });

  // Start Autoplay initially
  startAutoplay();
}
