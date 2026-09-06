const GITHUB_USER = "marcos-dev86";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   0. TEMA — claro/escuro (padrão: escuro)
========================================================= */
function setupTheme() {
  const toggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const STORAGE_KEY = "marcos-dev86-theme";

  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved === "light" ? "light" : "dark");

  function applyTheme(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    if (toggle) toggle.setAttribute("aria-checked", theme === "light" ? "true" : "false");
  }

  function toggleTheme() {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
}

/* =========================================================
   1. TERMINAL — efeito de digitação no hero
========================================================= */
const terminalLines = [
  { text: "$ whoami", pause: 300 },
  { text: "Marcos • full stack developer", pause: 500, muted: true },
  { text: "", pause: 200 },
  { text: "$ cat missao.txt", pause: 300 },
  { text: "transformar ideias em aplicações", pause: 60, muted: true },
  { text: "rápidas, funcionais e bem feitas.", pause: 500, muted: true },
  { text: "", pause: 200 },
  { text: "$ ./abrir_projetos.js", pause: 300 },
];

async function typeTerminal() {
  const out = document.getElementById("terminal-output");
  if (!out) return;

  if (reduceMotion) {
    out.textContent = terminalLines.map((l) => l.text).join("\n");
    return;
  }

  for (const line of terminalLines) {
    const span = document.createElement("div");
    out.appendChild(span);
    for (const char of line.text) {
      span.textContent += char;
      await sleep(14 + Math.random() * 18);
    }
    await sleep(line.pause);
  }

  const cursor = document.createElement("span");
  cursor.textContent = "▋";
  cursor.style.animation = "blink 1s steps(1) infinite";
  out.appendChild(cursor);

  const style = document.createElement("style");
  style.textContent = "@keyframes blink{50%{opacity:0}}";
  document.head.appendChild(style);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* =========================================================
   2. REVEAL ON SCROLL
========================================================= */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* =========================================================
   3. STATUS BAR + ABA ATIVA — reage à seção visível
========================================================= */
function setupStatusBar() {
  const sections = document.querySelectorAll(".section[id]");
  const statusFile = document.getElementById("status-file");
  const statusPos = document.getElementById("status-pos");
  const tabs = document.querySelectorAll(".tab");

  const fileMap = {
    home: "home.tsx",
    sobre: "sobre.md",
    stack: "stack.json",
    projetos: "projetos/index.ts",
    github: "github.stats",
    contato: "contato.html",
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (statusFile) statusFile.textContent = fileMap[id] || id;
          if (statusPos) {
            const ln = Math.floor(Math.random() * 80) + 12;
            const col = Math.floor(Math.random() * 40) + 1;
            statusPos.textContent = `Ln ${ln}, Col ${col}`;
          }
          tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.tab === id));
        }
      });
    },
    { threshold: 0.4, rootMargin: "-45% 0px -45% 0px" }
  );

  sections.forEach((s) => io.observe(s));
}

/* =========================================================
   4. STACK — widget de categorias + grid de tecnologias
========================================================= */
const SKILL_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "HTML5", abbr: "5", color: "#e34f26" },
      { name: "CSS3", abbr: "3", color: "#1572b6" },
      { name: "JavaScript", abbr: "JS", color: "#f0db4f" },
      { name: "TypeScript", abbr: "TS", color: "#3178c6" },
      { name: "React", abbr: "⚛", color: "#5fd4c4" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "Python", abbr: "Py", color: "#4b8bbe" },
      { name: "Java", abbr: "Jv", color: "#f89820" },
      { name: "Node.js", abbr: "Nd", color: "#3c873a" },
      { name: "C++", abbr: "C++", color: "#00599c" },
    ],
  },
  {
    id: "dados",
    label: "Dados",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "SQL", abbr: "SQL", color: "#e38c9e" },
      { name: "PostgreSQL", abbr: "PG", color: "#336791" },
      { name: "MySQL", abbr: "My", color: "#f29111" },
    ],
  },
  {
    id: "versionamento",
    label: "Versionamento",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "Git", abbr: "Git", color: "#f05032" },
      { name: "GitHub", abbr: "GH", color: "#a9b1bd" },
    ],
  },
  {
    id: "desenvolvimento",
    label: "Desenvolvimento",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "VS Code", abbr: "VS", color: "#007acc" },
      { name: "Expo Go", abbr: "Ex", color: "#4630eb" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "Docker", abbr: "Dk", color: "#2496ed" },
      { name: "Linux", abbr: "Lx", color: "#f0c14e" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "Vercel", abbr: "▲", color: "#9ca3af" },
      { name: "Computação em Nuvem", abbr: "☁", color: "#38bdf8" },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: '<path d="M3 6.5C3 5.67 3.67 5 4.5 5H9l2 2h8.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
    items: [
      { name: "Canva", abbr: "Cv", color: "#00c4cc" },
      { name: "Figma", abbr: "Fg", color: "#a259ff" },
    ],
  },
];

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setupSkillsWidget() {
  const categoriesEl = document.getElementById("skillsCategories");
  const gridEl = document.getElementById("skillsGrid");
  if (!categoriesEl || !gridEl) return;

  categoriesEl.innerHTML = SKILL_CATEGORIES.map(
    (cat, i) => `
    <button class="skills-category${i === 0 ? " is-active" : ""}"
      data-category="${cat.id}" role="tab" aria-selected="${i === 0}">
      <span class="skills-category-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">${cat.icon}</svg>
      </span>
      <span class="skills-category-label">${cat.label}</span>
      <span class="skills-category-count">${cat.items.length}</span>
    </button>`
  ).join("");

  function renderCategory(categoryId) {
    const cat = SKILL_CATEGORIES.find((c) => c.id === categoryId);
    if (!cat) return;

    gridEl.innerHTML = cat.items
      .map(
        (item, i) => `
      <div class="skill-card" tabindex="0" style="animation-delay:${i * 40}ms">
        <span class="skill-icon" style="color:${item.color}; background:${hexToRgba(item.color, 0.16)}; border:1px solid ${hexToRgba(item.color, 0.4)}">
          ${item.abbr}
        </span>
        <span class="skill-name">${item.name}</span>
      </div>`
      )
      .join("");

    categoriesEl.querySelectorAll(".skills-category").forEach((btn) => {
      const isActive = btn.dataset.category === categoryId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });
  }

  categoriesEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".skills-category");
    if (!btn) return;
    renderCategory(btn.dataset.category);
  });

  renderCategory(SKILL_CATEGORIES[0].id);
}

/* =========================================================
   5. PROJETOS — busca repositórios reais via API do GitHub
========================================================= */
const FEATURED_REPO = "90mais3";

const FALLBACK_PROJECTS = [
  {
    name: "90mais3",
    description: "E-commerce completo, do catálogo ao checkout.",
    html_url: "https://github.com/marcos-dev86",
    language: "JavaScript",
    stargazers_count: 0,
  },
  {
    name: "the-daxy-world",
    description: "Website institucional com foco em performance.",
    html_url: "https://github.com/marcos-dev86",
    language: "JavaScript",
    stargazers_count: 0,
  },
];

async function loadProjects() {
  const grid = document.getElementById("project-grid");
  const template = document.getElementById("project-card-template");
  if (!grid || !template) return;

  let repos = [];
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`
    );
    if (!res.ok) throw new Error("API indisponível");
    const data = await res.json();
    repos = data
      .filter((r) => !r.fork)
      // remove o próprio repositório do portfólio (username/username),
      // que não é um "projeto" e sempre aparece por ser atualizado com frequência
      .filter((r) => r.name.toLowerCase() !== GITHUB_USER.toLowerCase())
      .slice(0, 6);
  } catch (err) {
    repos = [];
  }

  if (repos.length === 0) repos = FALLBACK_PROJECTS;

  // Projeto destaque (citado no README) sempre aparece primeiro
  const featuredIndex = repos.findIndex(
    (r) => r.name.toLowerCase() === FEATURED_REPO.toLowerCase()
  );
  if (featuredIndex > 0) {
    const [featured] = repos.splice(featuredIndex, 1);
    repos.unshift(featured);
  }

  repos.forEach((repo) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".project-card");
    card.href = repo.html_url;

    node.querySelector(".project-name").textContent = repo.name;
    node.querySelector(".project-desc").textContent =
      repo.description || "Sem descrição por enquanto — dá uma olhada no repositório.";

    const isFeatured = repo.name.toLowerCase() === FEATURED_REPO.toLowerCase();
    const badgeEl = node.querySelector(".project-badge");
    if (isFeatured) {
      card.classList.add("is-featured");
    } else if (badgeEl) {
      badgeEl.remove();
    }

    const langEl = node.querySelector(".project-lang");
    if (repo.language) {
      langEl.textContent = repo.language;
    } else {
      langEl.remove();
    }

    const starsEl = node.querySelector(".project-stars");
    starsEl.textContent = `★ ${repo.stargazers_count || 0}`;

    grid.appendChild(node);
  });
}

/* =========================================================
   6. GITHUB — estatísticas públicas ao vivo (followers, repos)
========================================================= */
async function loadLiveStats() {
  const el = document.getElementById("gh-live-stats");
  if (!el) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error("API indisponível");
    const user = await res.json();

    const stats = [
      { label: "repositórios públicos", value: user.public_repos },
      { label: "seguidores", value: user.followers },
      { label: "seguindo", value: user.following },
    ];

    el.innerHTML = stats
      .map(
        (s) => `
        <div class="gh-stat-chip">
          <strong>${s.value ?? "—"}</strong>
          ${s.label}
        </div>`
      )
      .join("");
  } catch (err) {
    el.remove();
  }
}

/* =========================================================
   INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  typeTerminal();
  setupReveal();
  setupStatusBar();
  setupSkillsWidget();
  loadProjects();
  loadLiveStats();
});
