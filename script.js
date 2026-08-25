const GITHUB_USER = "marcos-dev86";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  { text: "$ ./abrir_projetos.sh", pause: 300 },
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
    contato: "contato.sh",
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
   4. PROJETOS — busca repositórios reais via API do GitHub
========================================================= */
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

  repos.forEach((repo) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".project-card");
    card.href = repo.html_url;

    node.querySelector(".project-name").textContent = repo.name;
    node.querySelector(".project-desc").textContent =
      repo.description || "Sem descrição por enquanto — dá uma olhada no repositório.";

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
   5. GITHUB — estatísticas públicas ao vivo (followers, repos)
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
  typeTerminal();
  setupReveal();
  setupStatusBar();
  loadProjects();
  loadLiveStats();
});
