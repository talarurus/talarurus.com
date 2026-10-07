// Progressive enhancement only: every page works without JavaScript.
// Loaded in <head> without defer so the "js" and "motion" classes are set
// before first paint, which keeps the mobile menu and reveals from flashing.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var hasObserver = "IntersectionObserver" in window;

  root.classList.add("js");
  // Hidden "before" states in the CSS only apply under .motion.
  if (hasObserver && !(reduceQuery && reduceQuery.matches)) root.classList.add("motion");

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initCopy();
    if (!hasObserver) return;
    try {
      initHeaderState();
      initReveals();
      initAmbient();
      initSubnav();
    } catch (error) {
      // Any observer failure: withdraw motion so all content stays visible.
      root.classList.remove("motion");
    }
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
      var label = button.textContent;
      var reset;
      button.hidden = false;
      button.addEventListener("click", function () {
        navigator.clipboard.writeText(button.dataset.copy).then(
          function () {
            button.textContent = "Copied";
            button.classList.add("is-done");
            clearTimeout(reset);
            reset = setTimeout(function () {
              button.textContent = label;
              button.classList.remove("is-done");
            }, 2000);
            announce("Email address copied.");
          },
          function () { announce("Could not copy. Select the address instead."); }
        );
      });
    });
  }

  // Header gains its border and shadow once content passes underneath.
  function initHeaderState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var sentinel = document.createElement("div");
    sentinel.className = "scroll-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
    root.classList.add("header-observed");
  }

  function initReveals() {
    if (!root.classList.contains("motion")) return;
    var targets = document.querySelectorAll("[data-reveal]");

    function reveal(el) {
      el.classList.add("is-visible");
      // Once a plain or staggered reveal has finished, drop its hooks so
      // hover transitions run without reveal timing. The end state matches
      // the element's normal styling, so nothing visibly changes.
      var type = el.getAttribute("data-reveal");
      if (type === "" || type === "stagger") {
        setTimeout(function () { el.removeAttribute("data-reveal"); }, 2000);
      }
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });

    // The diagram waits until most of it is on screen before playing.
    var flowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        flowObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    targets.forEach(function (el) {
      (el.getAttribute("data-reveal") === "flow" ? flowObserver : observer).observe(el);
    });

    // If the visitor turns on reduced motion mid-visit, show everything.
    if (reduceQuery && reduceQuery.addEventListener) {
      reduceQuery.addEventListener("change", function (event) {
        if (event.matches) root.classList.remove("motion");
      });
    }
  }

  // Ambient background animations run only while their area is on screen.
  function initAmbient() {
    if (!root.classList.contains("motion")) return;
    var areas = document.querySelectorAll("[data-ambient]");
    if (!areas.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("ambient-on", entry.isIntersecting);
      });
    });
    areas.forEach(function (area) { observer.observe(area); });
  }

  // Marks the Hammerhead subnav link for the section currently in view.
  function initSubnav() {
    var list = document.querySelector(".subnav ul");
    if (!list) return;
    var links = {};
    var sections = [];
    list.querySelectorAll("a[href^='#']").forEach(function (a) {
      var section = document.getElementById(a.getAttribute("href").slice(1));
      if (!section) return;
      links[section.id] = a;
      sections.push(section);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].removeAttribute("aria-current"); });
        var link = links[entry.target.id];
        if (!link) return; // back at the page intro: no section is current
        link.setAttribute("aria-current", "true");
        // Keep the current link visible when the subnav scrolls horizontally.
        if (link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth) {
          list.scrollLeft = link.offsetLeft - 16;
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { observer.observe(section); });
    var intro = document.querySelector(".page-hero");
    if (intro) observer.observe(intro);
  }
})();
