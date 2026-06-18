const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
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

  gsap.from(".hero__kicker, .hero h1, .hero__intro, .hero__image", {
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

  gsap.utils.toArray("section:not(.hero), .project, .gallery-grid figure, .service-list article, .process-grid article, .values-section article").forEach((element) => {
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

  gsap.utils.toArray(".hero__image img, .project img, .page-hero img").forEach((image) => {
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
