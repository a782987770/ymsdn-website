/* ===== 粒子背景配置 ===== */
particlesJS("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 1000 } },
    color: { value: ["#2563eb", "#f97316"] },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#2563eb", opacity: 0.15, width: 1 },
    move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
    modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } }, push: { particles_nb: 3 } }
  },
  retina_detect: true
});

/* ===== 导航栏滚动 ===== */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

/* ===== 移动端汉堡菜单 ===== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

/* ===== 滚动淡入动画 ===== */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".glass, .section-header, .card, .article-card, .quick-item, .repair-form, .about-card, .qrcode-card").forEach(el => {
  el.classList.add("fade-in");
  observer.observe(el);
});

/* ===== 平滑锚点 ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ===== 导航高亮 ===== */
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });
  navLinks.querySelectorAll("a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});

/* ===== 搜索功能 ===== */
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.open(`https://mp.weixin.qq.com/s/havu_WZ8Miv27NmwWuRsOw`, "_blank");
    }
  });
}

/* ===== 维修表单提交(邮件通知) ===== */
document.getElementById("repairForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const origText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
  btn.disabled = true;
  try {
    const fd = new FormData(this);
    fd.append("access_key", "4b115ebd-5252-4630-93e2-4730c28d0b95");
    fd.append("subject", "新维修订单");
    fd.append("from_name", "壹米电脑官网");
    fd.delete("_honey");
    const resp = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
    const result = await resp.json();
    if (result.success) {
      btn.innerHTML = '<i class="fas fa-check"></i> 提交成功！';
      btn.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
      this.reset();
    } else { throw new Error(result.message); }
  } catch (err) {
    btn.innerHTML = '<i class="fas fa-times"></i> 提交失败';
    btn.style.background = "linear-gradient(135deg,#ef4444,#dc2626)";
    console.error("表单提交错误:", err);
  }
  setTimeout(() => { btn.innerHTML = origText; btn.style.background = ""; btn.disabled = false; }, 3000);
});
