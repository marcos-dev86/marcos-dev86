(function () {
  "use strict";

  var GH_USER = "marcos-dev86";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ 1. terminal digitando ============ */
  function typeTerminal() {
    var out = document.getElementById("terminal-output");
    if (!out) return;

    var lines = [
      { cmd: "whoami" },
      { out: "Marcos — Full Stack Developer" },
      { cmd: "cat sobre.txt" },
      { out: "Curioso, gosto de entender a stack inteira antes de codar." },
      { cmd: "./abrir_projetos.sh" },
      { out: "6 projetos carregados ✓" },
      { cmd: "_", cursor: true }
    ];

    if (reduceMotion) {
      out.textContent = lines
        .map(function (l) {
          return l.cmd ? "marcos@dev86:~$ " + l.cmd : l.out;
        })
        .join("\n");
      return;
    }

    out.textContent = "";
    var lineIndex = 0;
    var charIndex = 0;

    function typeChar() {
      if (lineIndex >= lines.length) return;
      var line = lines[lineIndex];
      var prefix = line.cmd ? "marcos@dev86:~$ " : "";
      var full = prefix + (line.cmd || line.out);

      if (charIndex === 0 && lineIndex > 0) out.textContent += "\n";

      if (charIndex < full.length) {
        out.textContent += full.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, line.out ? 12 : 32);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeChar, 260);
      }
    }
    typeChar();
  }

  /* ============ 2. reveal on scroll ============ */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { io.observe(el); });
  }

  /* ============ 3. tabs + status bar ativos por seção ============ */
  function setupSectionTracking() {
    var sections = document.querySelectorAll("main .section[id]");
    var tabs = document.querySelectorAll(".tab");
    var statusFile = document.getElementById("status-file");
    var statusPos = document.getElementById("status-pos");

    var fileNames = {
      home: "home.tsx",
      sobre: "sobre.md",
      stack: "stack.json",
      projetos: "projetos/",
      github: "github.stats",
      contato: "contato.html"
    };

    if (!sections.length || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;

          tabs.forEach(function (tab) {
            tab.classList.toggle("is-active", tab.dataset.tab === id);
          });

          if (statusFile && fileNames[id]) statusFile.textContent = fileNames[id];
          if (statusPos) {
            var idx = Array.prototype.indexOf.call(sections, entry.target) + 1;
            statusPos.textContent = "Ln " + idx + ", Col 1";
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ============ 4. projetos via API do GitHub ============ */
  function loadProjects() {
    var grid = document.getElementById("project-grid");
    var template = document.getElementById("project-card-template");
    var lsLine = document.querySelector(".ls-line .text-muted");
    if (!grid || !template) return;

    fetch("https://api.github.com/users/" + GH_USER + "/repos?sort=updated&per_page=100")
      .then(function (res) {
        if (!res.ok) throw new Error("github api error");
        return res.json();
      })
      .then(function (repos) {
        var list = repos
          .filter(function (r) { return !r.fork; })
          .sort(function (a, b) { return new Date(b.pushed_at) - new Date(a.pushed_at); })
          .slice(0, 6);

        if (!list.length) throw new Error("sem repositorios publicos");

        list.forEach(function (repo) {
          var node = template.content.cloneNode(true);
          var card = node.querySelector(".project-card");
          card.href = repo.html_url;
          node.querySelector(".project-name").textContent = repo.name;
          node.querySelector(".project-desc").textContent =
            repo.description || "Sem descrição no repositório.";
          node.querySelector(".project-lang").textContent = repo.language || "—";
          node.querySelector(".project-stars").textContent = "★ " + repo.stargazers_count;
          grid.appendChild(node);
        });

        if (lsLine) lsLine.textContent = list.length + " repositórios carregados do GitHub";
      })
      .catch(function () {
        if (lsLine) lsLine.textContent = "não foi possível carregar agora — veja direto no GitHub";
        var fallback = document.createElement("p");
        fallback.className = "repo-empty";
        fallback.innerHTML =
          'Não consegui carregar os repositórios aqui. <a href="https://github.com/' +
          GH_USER +
          '" target="_blank" rel="noopener" style="color:var(--accent2)">Ver perfil no GitHub →</a>';
        grid.appendChild(fallback);
      });
  }

  /* ============ 5. cartões de estatísticas do GitHub ============ */
  function loadStats() {
    var el = document.getElementById("gh-live-stats");
    if (!el) return;

    var base = "https://github-readme-stats.vercel.app/api";
    var common =
      "&theme=transparent&hide_border=true&title_color=E9A23B&icon_color=5FB3B3&text_color=C9D1D9&bg_color=00000000";

    el.innerHTML =
      '<img class="stat-wide" loading="lazy" alt="Estatísticas do GitHub de ' + GH_USER + '" ' +
      'src="' + base + '?username=' + GH_USER + '&show_icons=true' + common + '">' +
      '<img loading="lazy" alt="Linguagens mais usadas por ' + GH_USER + '" ' +
      'src="' + base + '/top-langs/?username=' + GH_USER + '&layout=compact' + common + '">' +
      '<img loading="lazy" alt="Streak de contribuições de ' + GH_USER + '" ' +
      'src="https://streak-stats.demolab.com/?user=' + GH_USER +
      '&theme=transparent&hide_border=true&background=00000000&ring=E9A23B&fire=E9A23B&currStreakLabel=E9A23B&sideNums=C9D1D9&sideLabels=C9D1D9&dates=7B8496&stroke=232838">';

    var imgs = el.querySelectorAll("img");
    var failed = 0;
    imgs.forEach(function (img) {
      img.addEventListener("error", function () {
        img.remove();
        failed++;
        if (failed === imgs.length) {
          var p = document.createElement("p");
          p.className = "stats-fallback";
          p.innerHTML =
            'Os cartões de estatísticas estão indisponíveis no momento. ' +
            '<a href="https://github.com/' + GH_USER + '" target="_blank" rel="noopener">Ver perfil no GitHub →</a>';
          el.appendChild(p);
        }
      });
    });
  }

  /* ============ init ============ */
  document.addEventListener("DOMContentLoaded", function () {
    typeTerminal();
    setupReveal();
    setupSectionTracking();
    loadProjects();
    loadStats();
  });
})();
