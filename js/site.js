// Progressive enhancement only: every page works without JavaScript.
// Loaded in <head> without defer so the "js" class is set before first paint,
// which keeps the mobile menu from flashing open.
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initCopy();
  });

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      root.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && root.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    window.matchMedia("(min-width: 56rem)").addEventListener("change", function (event) {
      if (event.matches) setOpen(false);
    });
  }

  function initCopy() {
    var buttons = document.querySelectorAll("button[data-copy]");
    if (!buttons.length || !navigator.clipboard || !window.isSecureContext) return;

    var status = document.querySelector(".copy-status");
    var timer;

    function announce(message) {
      if (!status) return;
      status.textContent = message;
      clearTimeout(timer);
      timer = setTimeout(function () { status.textContent = ""; }, 4000);
    }

    buttons.forEach(function (button) {
      button.hidden = false;
      button.addEventListener("click", function () {
        navigator.clipboard.writeText(button.dataset.copy).then(
          function () { announce("Email address copied."); },
          function () { announce("Could not copy. Select the address instead."); }
        );
      });
    });
  }
})();
