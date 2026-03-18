gsap.registerPlugin(ScrollTrigger);

// ─── LOADER ───
const loaderBar = document.getElementById("loader-bar");
const loaderCount = document.getElementById("loader-count");
let progress = 0;

gsap.from("#ln1", {
  opacity: 0,
  x: -16,
  duration: 0.7,
  ease: "power3.out",
  delay: 0.1,
});
gsap.from("#ln3", {
  opacity: 0,
  y: 24,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.2,
});

const countInterval = setInterval(() => {
  progress += Math.random() * 14;
  if (progress >= 100) {
    progress = 100;
    clearInterval(countInterval);
    finishLoader();
  }
  loaderBar.style.width = progress + "%";
  loaderCount.textContent = String(Math.floor(progress)).padStart(3, "0");
}, 75);

function finishLoader() {
  setTimeout(() => {
    gsap
      .timeline()
      .to(["#ln1", "#ln3"], {
        opacity: 0,
        y: -20,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.05,
      })
      .to("#loader", {
        y: "-100%",
        duration: 0.85,
        ease: "power4.inOut",
        onStart: () => initAnimations(),
      })
      .call(() => {
        document.getElementById("loader").style.display = "none";
      });
  }, 300);
}

// ─── CURSOR ───
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
});
document.addEventListener("mousedown", () =>
  document.body.classList.add("clicking"),
);
document.addEventListener("mouseup", () =>
  document.body.classList.remove("clicking"),
);

(function updateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  gsap.set(ring, { x: ringX, y: ringY });
  requestAnimationFrame(updateRing);
})();

document
  .querySelectorAll('a, button, [tabindex="0"], .project-item, .skill-item')
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("hovering"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("hovering"),
    );
  });

// ─── SCROLL PROGRESS ───
window.addEventListener(
  "scroll",
  () => {
    const pct =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    document.getElementById("progress-bar").style.width = pct + "%";
  },
  { passive: true },
);

// ─── SPOTLIGHT CANVAS ───
const canvas = document.getElementById("spotlight-canvas");
const ctx = canvas.getContext("2d");
let spotX = -999,
  spotY = -999;
let spotVisible = false;

function resizeCanvas() {
  const hero = document.getElementById("hero");
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.getElementById("hero").addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  spotX = e.clientX - rect.left;
  spotY = e.clientY - rect.top;
  if (!spotVisible) {
    spotVisible = true;
    canvas.style.opacity = "1";
  }
});
document.getElementById("hero").addEventListener("mouseleave", () => {
  spotVisible = false;
  canvas.style.opacity = "0";
});

function drawSpotlight() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (spotVisible) {
    const grad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 320);
    grad.addColorStop(0, "rgba(212,255,0,0.055)");
    grad.addColorStop(0.5, "rgba(212,255,0,0.02)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(drawSpotlight);
}
drawSpotlight();

// ─── TYPED ROLE ───
const roles = [
  "Full Stack Developer",
  "UI/UX Enthusiast",
  "Problem Solver",
  "Cybersecurity Enthusiast",
];
let roleIdx = 0,
  charIdx = 0,
  deleting = false;
const typedEl = document.getElementById("typed-role");

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 40 : 80);
}

// ─── TEXT SCRAMBLE ───
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function scramble(el, finalText, duration = 1200) {
  el.style.whiteSpace = "nowrap";
  let frame = 0;
  const totalFrames = duration / 16;
  const interval = setInterval(() => {
    const progress = frame / totalFrames;
    const revealedCount = Math.floor(progress * finalText.length);
    let result = "";
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === " ") {
        result += " ";
        continue;
      }
      if (i < revealedCount) {
        result += finalText[i];
      } else {
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    el.textContent = result;
    frame++;
    if (frame >= totalFrames) {
      el.textContent = finalText;
      el.style.whiteSpace = "";
      clearInterval(interval);
    }
  }, 16);
}

// ─── 3D TILT ───
const tiltCard = document.getElementById("tilt-card");
tiltCard.addEventListener("mousemove", (e) => {
  const rect = tiltCard.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  gsap.to(tiltCard, {
    rotateY: x * 14,
    rotateX: -y * 14,
    duration: 0.4,
    ease: "power2.out",
    transformPerspective: 800,
  });
});
tiltCard.addEventListener("mouseleave", () => {
  gsap.to(tiltCard, {
    rotateY: 0,
    rotateX: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.4)",
  });
});

// ─── MAIN ANIMATIONS ───
function initAnimations() {
  // Learning badge
  gsap.from("#learning-badge", {
    opacity: 0,
    y: 12,
    duration: 0.6,
    ease: "power3.out",
    delay: 0.0,
  });

  // Hero eyebrow
  gsap.from("#hero-eyebrow", {
    opacity: 0,
    x: -24,
    duration: 0.7,
    ease: "power3.out",
    delay: 0.05,
  });

  // Name scramble — lock line heights first to prevent layout jitter
  document.querySelectorAll(".hero-line").forEach((line) => {
    line.style.height = line.offsetHeight + "px";
  });
  const scrambleTargets = { hl1: "BUILD", hl2: "THINGS", hl3: "THAT WORK" };
  ["hl1", "hl2", "hl3"].forEach((id, i) => {
    const el = document.getElementById(id);
    const final = scrambleTargets[id];
    el.textContent = final;
    gsap.set(el, { opacity: 0 });
    gsap.to(el, { opacity: 1, duration: 0.05 });
    setTimeout(() => scramble(el, final, 1500), 0);
  });

  // Desc + CTA
  gsap.to("#hero-desc", {
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.65,
  });
  gsap.to("#hero-cta", {
    opacity: 1,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.8,
  });

  // Start typed role
  setTimeout(typeRole, 900);

  // Parallax hero name
  gsap.to("#hero .hero-name", {
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.8,
    },
    y: -100,
    ease: "none",
  });

  // Projects
  gsap.from(".projects-title", {
    scrollTrigger: { trigger: "#projects", start: "top 82%" },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  });
  document.querySelectorAll(".project-item").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      x: -36,
      opacity: 0,
      duration: 0.65,
      ease: "power3.out",
      delay: i * 0.07,
    });
  });

  // About
  gsap.from(".about-big", {
    scrollTrigger: { trigger: "#about", start: "top 78%" },
    y: 50,
    opacity: 0,
    duration: 0.95,
    ease: "power3.out",
  });
  gsap.from(".about-body", {
    scrollTrigger: { trigger: "#about", start: "top 74%" },
    y: 24,
    opacity: 0,
    duration: 0.85,
    ease: "power3.out",
    delay: 0.18,
  });
  gsap.from(".about-photo", {
    scrollTrigger: { trigger: ".about-right", start: "top 82%" },
    y: 70,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
  });
  gsap.from(".about-info-row", {
    scrollTrigger: { trigger: ".about-info", start: "top 88%" },
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.08,
  });

  // Counters
  document.querySelectorAll(".stat-num[data-target]").forEach((el) => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: function () {
              el.textContent = Math.ceil(this.targets()[0].val) + "+";
            },
          },
        );
      },
    });
  });

  // Skills
  document.querySelectorAll(".skill-item").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 92%" },
      y: 24,
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      delay: (i % 6) * 0.04,
    });
  });

  // Contact
  document.querySelectorAll(".contact-big span").forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: "#contact", start: "top 78%" },
      y: 70,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out",
      delay: i * 0.1,
    });
  });
  gsap.from(".contact-email", {
    scrollTrigger: { trigger: ".contact-email", start: "top 92%" },
    y: 24,
    opacity: 0,
    duration: 0.75,
    ease: "power3.out",
  });

  // Section labels
  document.querySelectorAll(".section-label").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 92%" },
      x: -18,
      opacity: 0,
      duration: 0.55,
      ease: "power2.out",
    });
  });
}

// ─── MAGNETIC BUTTONS ───
document.querySelectorAll(".btn-magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" });
  });
});

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById("hamburger");
const drawer = document.getElementById("mobile-drawer");
hamburger.addEventListener("click", () => {
  const isOpen = drawer.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});
document.querySelectorAll(".drawer-link").forEach((link) => {
  link.addEventListener("click", () => {
    drawer.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// ─── KEYBOARD ACCESS ───
document.querySelectorAll(".project-item").forEach((item) => {
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter") item.click();
  });
});
