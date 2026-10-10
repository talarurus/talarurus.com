/* A quiet, layered ASCII valley. No images, shaders, dependencies or requests.
   The same deterministic scene supplies the HTML fallback and canvas layers.
   Geometry is sampled only on resize; animation moves cached layers. */
(function () {
  "use strict";

  var profiles = [
    [[0,.32],[.04,.22],[.07,.28],[.12,.18],[.16,.26],[.22,.34],[.32,.44],[.39,.48],[.48,.51],[.58,.46],[.65,.40],[.71,.34],[.80,.27],[.85,.19],[.91,.30],[.96,.24],[1,.31]],
    [[0,.57],[.08,.49],[.17,.54],[.25,.48],[.34,.61],[.44,.65],[.55,.63],[.64,.57],[.72,.47],[.81,.52],[.90,.42],[1,.51]],
    [[0,.65],[.10,.61],[.21,.67],[.34,.73],[.46,.78],[.57,.77],[.67,.69],[.79,.65],[.89,.58],[1,.62]],
    [[0,.75],[.11,.79],[.24,.86],[.38,.94],[.52,.98],[.64,.94],[.78,.83],[.90,.76],[1,.72]]
  ];
  var palettes = [".,-:=+/", ".,:;=+/x", ".,:;=+xX", ".,:;=+xX#"];

  function ridge(x, layer) {
    var points = profiles[layer], i = 1;
    while (i < points.length - 1 && x > points[i][0]) i++;
    var a = points[i - 1], b = points[i];
    var t = Math.max(0, Math.min(1, (x - a[0]) / (b[0] - a[0])));
    if (layer > 1) t = t * t * (3 - 2 * t);
    return a[1] + (b[1] - a[1]) * t +
      (Math.sin(x * 173 + layer * 7) * .004 + Math.sin(x * 79 + layer) * .006) * (layer < 2 ? 1 : .5);
  }

  function sample(x, y, layer, rows) {
    var top = ridge(x, layer);
    if (y < top) return " ";
    var depth = y - top;
    var slope = (ridge(x + .002, layer) - ridge(x - .002, layer)) / .004;
    // Slashes follow the actual slope of the skyline and the rock strata.
    if (depth < 1 / rows) return slope < -.18 ? "/" : slope > .18 ? "\\" : "_";
    var strata = Math.sin(depth * (140 - layer * 17) + x * 23 + Math.sin(x * 39) * 1.8);
    var facets = Math.sin(x * 83 + depth * 24) * .15 + Math.sin(x * 197 - depth * 45) * .08;
    var light = Math.max(0, Math.min(.99, .32 + slope * .18 + facets * .55 + strata * .08 + depth * .25));
    var palette = palettes[layer];
    // Thin contour bands and broken scree, anchored to the rock geometry.
    if (strata > .94 && depth > .035) return slope < 0 ? "/" : "\\";
    if (layer > 1 && Math.sin(x * 541 + y * 193) > .76) return " ";
    return palette[Math.floor(light * palette.length)];
  }

  function cloud(x, y) {
    var bodies = [[.12,.16,.13,.025],[.52,.12,.17,.022],[.91,.19,.13,.028]];
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      var u = (x - b[0]) / b[2], v = (y - b[1]) / b[3];
      var shape = u * u + v * v + Math.sin(x * 113) * .13;
      if (shape < 1) return shape > .65 ? "." : v > .3 ? "_" : "-";
    }
    // Two tiny distant birds, drawn as a pair of wings.
    if (Math.abs(y - .245) < .003 && (Math.abs(x - .38) < .004 || Math.abs(x - .397) < .003)) return "~";
    return " ";
  }

  function still(columns, rows) {
    var lines = [];
    for (var row = 0; row < rows; row++) {
      var line = "";
      for (var col = 0; col < columns; col++) {
        var x = col / (columns - 1), y = row / (rows - 1), glyph = cloud(x, y);
        for (var layer = 0; layer < 4; layer++) {
          var next = sample(x, y, layer, rows);
          if (y >= ridge(x, layer)) glyph = next;
        }
        line += glyph;
      }
      lines.push(line.replace(/ +$/, ""));
    }
    return lines.join("\n");
  }

  // Used by the documented fallback-generation command, without a DOM.
  if (typeof module === "object" && module.exports) module.exports = { still: still };
  if (typeof document === "undefined") return;

  function init() {
    var scene = document.querySelector(".ascii-landscape");
    if (!scene) return;
    var canvas = scene.querySelector("canvas"), context = canvas.getContext("2d");
    if (!context) return;
    var hero = scene.parentElement, toggle = hero.querySelector(".landscape-toggle");
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var layers = [], width = 0, height = 0, frame = 0, last = 0, elapsed = 0;
    var visible = true, paused = false, timer, protection = [];

    function active() { return visible && !document.hidden && !motion.matches && !paused; }

    function layout() {
      var box = scene.getBoundingClientRect();
      width = Math.round(box.width); height = Math.round(box.height);
      if (!width || !height) return;
      // Cap resolution and backing-store scale even on large/retina displays.
      var scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale); canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      var cell = Math.max(6.5, width / 220), lineHeight = cell * 1.7;
      var columns = Math.ceil(width / cell) + 8, rows = Math.ceil(height / lineHeight);
      // Protect the text lines, rather than erasing scenery across the entire
      // copy column. Ranges follow the existing wrapping at every viewport.
      protection = [];
      var copy = hero.querySelector(".hero-copy");
      var walker = document.createTreeWalker(copy || hero, NodeFilter.SHOW_TEXT);
      var node, range = document.createRange();
      while ((node = walker.nextNode())) {
        if (!node.textContent.trim()) continue;
        range.selectNodeContents(node);
        Array.from(range.getClientRects()).forEach(function (rect) {
          protection.push({
            x: rect.left - box.left, y: rect.top - box.top,
            w: rect.width, h: rect.height,
            floor: node.parentElement.closest(".hero-lead") ? .24 : .44
          });
        });
      }
      var ink = getComputedStyle(hero).getPropertyValue("--ink-3").trim();
      layers = [];
      for (var layer = -1; layer < 4; layer++) {
        var buffer = document.createElement("canvas");
        buffer.width = Math.round((width + cell * 8) * scale); buffer.height = canvas.height;
        var ctx = buffer.getContext("2d");
        ctx.scale(scale, scale);
        ctx.font = (cell / .602) + 'px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
        ctx.textBaseline = "top";
        ctx.fillStyle = ink;
        for (var row = 0; row < rows; row++) {
          for (var col = 0; col < columns; col++) {
            var x = col / (columns - 1), y = row / (rows - 1);
            var glyph = layer < 0 ? cloud(x, y) : sample(x, y, layer, rows);
            // Each nearer ridge occludes the terrain behind it.
            if (layer >= 0 && layer < 3 && y >= ridge(x, layer + 1)) continue;
            if (glyph === " ") continue;
            var px = col * cell - cell * 4, py = row * lineHeight;
            // Soft, narrow quiet areas keep copy legible while leaving the
            // mountains visible behind and between the original text lines.
            var quiet = 1;
            for (var k = 0; k < protection.length; k++) {
              var p = protection[k];
              var dx = Math.max(p.x - px - cell, 0, px - p.x - p.w);
              var dy = Math.max(p.y - py - lineHeight, 0, py - p.y - p.h);
              var distance = Math.min(1, Math.hypot(dx, dy) / 32);
              quiet = Math.min(quiet, p.floor + (1 - p.floor) * distance);
            }
            // Atmospheric depth and a clean transition at the hero's bottom.
            var fade = Math.min(1, (height - py) / 65);
            var alpha = (layer < 0 ? .40 : [.43,.50,.58,.66][layer]) * quiet * fade;
            ctx.globalAlpha = alpha;
            ctx.fillText(glyph, col * cell, py);
          }
        }
        layers.push(buffer);
      }
      draw();
      scene.classList.add("is-ready");
      if (toggle) { toggle.hidden = motion.matches; }
      sync();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      for (var i = 0; i < layers.length; i++) {
        var dx = i === 0 ? Math.sin(elapsed / 28) * 45 : Math.sin(elapsed / 38) * [0,1.5,3,6,10][i];
        var dy = i === 0 ? Math.sin(elapsed / 35) * 2 : Math.sin(elapsed / 44) * i * .45;
        var image = layers[i];
        context.drawImage(image, dx - (image.width / (canvas.width / width) - width) / 2, dy, image.width / (canvas.width / width), height);
      }
    }

    function tick(now) {
      frame = 0;
      if (!active()) return;
      if (now - last >= 50) {
        elapsed += Math.min(now - (last || now), 100) / 1000;
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (!active()) { cancelAnimationFrame(frame); frame = 0; last = 0; }
      else if (!frame) frame = requestAnimationFrame(tick);
    }

    if (toggle) toggle.addEventListener("click", function () {
      paused = !paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.textContent = paused ? "Resume scenery" : "Pause scenery";
      sync();
    });
    motion.addEventListener("change", function () {
      if (toggle) toggle.hidden = motion.matches;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting; sync();
    }).observe(hero);
    if ("ResizeObserver" in window) new ResizeObserver(function () {
      clearTimeout(timer); timer = setTimeout(layout, 140);
    }).observe(hero);
    else window.addEventListener("resize", function () {
      clearTimeout(timer); timer = setTimeout(layout, 140);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    else layout();
  }

  document.addEventListener("DOMContentLoaded", function () {
    // A failed canvas enhancement leaves the pre-rendered landscape in place.
    try { init(); } catch (error) { /* The original site stays fully usable. */ }
  });
})();
