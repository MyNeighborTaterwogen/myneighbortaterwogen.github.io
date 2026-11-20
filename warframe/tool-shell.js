(() => {
  "use strict";

  const nav = document.querySelector(".nav");
  const toggle = nav.querySelector(".nav__toggle");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll(".nav__links a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  document.querySelector("#year").textContent = new Date().getFullYear();
})();
