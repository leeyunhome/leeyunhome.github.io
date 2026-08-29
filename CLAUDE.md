# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal GitHub Pages site served at https://leeyunhome.github.io/ — a project hub landing page linking to the owner's other GitHub Pages projects (portfolio, AI experiments, browser tools).

**The entire live site is the single self-contained [index.html](index.html)** — all CSS is inline in a `<style>` block, vanilla JS only (no framework), no build step. Content is in Korean. Deployment is automatic: push to `main` and GitHub Pages serves it.

## Visitor analytics (owner-excluded)

`index.html`'s `<head>` loads Google Analytics 4 (`gtag.js`) via a small self-invoking script, so the owner can see visitor region (city-level, via GA's Reports) without a cookie banner or any visible indication to visitors.

- **Owner exclusion**: the script checks `localStorage['lyh_owner']` before loading GA at all. Visiting `https://leeyunhome.github.io/?owner=1` once (per browser/device) sets that flag permanently — no GA script loads for that browser afterward, regardless of network/IP. This is intentionally IP-independent (unlike GA's "internal traffic" filter) since the owner's IP changes across networks.
- **Don't add a consent banner or make this more visible** — that was a deliberate ask ("남들은 모르게"), not an oversight.
- The GA4 Measurement ID lives inline as `GA_ID` in the head script — if analytics stop reporting, check this ID is still valid in the GA4 property before debugging anything else.
- Low-traffic caveat: GA4 may suppress city-level breakdown as "(not set)" under its privacy thresholding when session volume is very small — this is GA's behavior, not a bug in the embed.

## Editing the hub page

- Project cards live in `index.html` inside seven tab panels (`#panel-graphics`, `#panel-tools`, `#panel-monitoring`, `#panel-embedded`, `#panel-ai`, `#panel-dataviz`, `#panel-deeplearning`), switched by plain vanilla-JS click handlers on `.tab-btn` — no framework, no build step. Each card is an `<a class="card">` with icon, title, description, and tech `badge-*` spans (`badge-js`, `badge-ts`, `badge-py`, `badge-html`, `badge-ai`, `badge-css`).
- Category convention:
  - **그래픽스**: rendering/graphics-tech projects (3DGS viewer, cloth sim).
  - **도구**: everyday utility apps with no AI model in the core pipeline and not a monitoring dashboard (PDF tool, image resizer, counters, portfolio link, mini-games).
  - **모니터링 도구**: real-time monitoring/dashboard UIs (stock ticker dashboard, edge-device fleet control room) — split out once there were 2+ of these; don't re-fold them back into 도구.
  - **임베디드 시스템**: hardware/systems infrastructure engineering where any ML involved is incidental, not the subject of study (device farm test automation, firmware/kernel tooling) — split out deliberately even while it held a single card; the owner wants this as its own category going forward, don't fold it back into 도구.
  - **AI 활용 서비스**: an AI model/API is a load-bearing part of the pipeline (Whisper ASR, Gemini chat, Imagen generation) — not just "written with AI help".
  - **데이터 시각화**: charting/analysis technique showcases (histogram/KDE comparisons, dataset exploration tools) — distinct from AI 활용 서비스 since the analysis itself isn't AI-model-driven.
  - **딥러닝**: ML/DL technique itself is the subject of study (autograd internals, optimizer comparisons, quantization mechanics, inference-optimization benchmarking) — regardless of what hardware it happens to run on. Corrected 2026-08-18: initially miscategorized a Jetson-hardware ML-optimization project into 임베디드 시스템 on a "ran on real hardware" test; VGG19 also runs on a real RTX 3080 server and stayed in 딥러닝, so hardware alone isn't the signal. The real distinction from 임베디드 시스템 is *what's being studied* (ML technique vs. systems/infra engineering), and from AI 활용 서비스 is *service vs. study* (there, a model is a component of something shipped to a user; here, the model/technique internals are the subject itself).
- Design tokens (colors, radius) are CSS custom properties in `:root` — **light theme only** (switched from dark 2026-08-17). There is no light/dark toggle; don't add one unless asked.
- **Badge colors are not tokenized** — each `.badge-*` rule hard-codes its `color` plus `44` (border) / `14` (background) alpha suffixes. The palette is held at ≥4.5:1 against `--surface` (#ffffff), i.e. WCAG AA for normal text, so when adding or changing a badge check the contrast rather than eyeballing it. The pre-2026-08-17 dark-theme badge colors (bright yellow `#f0c040`, green `#70c06a`, cyan `#5bc0de`) fail badly on white — don't reintroduce that family.
- `--accent` also needs the full 4.5:1 against `--bg`, not just against white: the footer link renders it at 12.5px, which counts as normal text. `#3b6fd4` measured 4.49:1 and had to be darkened to `#3767c9`.
- `<meta name="theme-color">` in the head should track `--bg` so mobile browser chrome matches the page.
- **Korean/English toggle (added 2026-08-18)**: the header has a `#langToggle` button. Translatable elements (`<title>`, tagline, tab labels, card titles/descriptions) carry a `data-en="..."` attribute holding the English HTML; the page-load script copies each element's *original* Korean `innerHTML` into `el.dataset.ko` automatically, so **you only ever author `data-en` by hand** — never hand-write a `data-ko` attribute, it's derived at runtime. Preference persists in `localStorage['lyh_lang']`; the default for first-time visitors is **English** (changed 2026-08-18) — `<html lang="en">` and the JS default both need to move together if this is ever flipped back. When adding a new card or tab, add `data-en="..."` to its title/desc/label element in the same edit — don't leave new content Korean-only.
- Keep AI badges accurate to what each project actually uses (this has been a source of past corrections — see commit history).

## Lessons learned (workflow gotchas)

- **A commit is not a deploy.** GitHub Pages only serves what's on `origin/main`. After committing, changes won't show on https://leeyunhome.github.io/ until `git push origin main` succeeds — if the user reports "I don't see the change," check `git status`/`git log` for unpushed commits before touching code.
- **`main` gets pushed to from elsewhere between sessions.** Other sessions/tools push directly to `main` outside this conversation (e.g. a "Add Cloth Lab card" commit landed while this session had local changes). Always `git fetch` and check `git log HEAD..origin/main` before pushing — a plain `git push` can get rejected (non-fast-forward), and multiple sessions editing the same card list in `index.html` produces real merge conflicts, not just fast-forwards. Resolve with `git pull --rebase origin main`, then manually reconcile the `<<<<<<</=======/>>>>>>>` markers card-by-card (don't just take one side — both sides usually added different cards).

## Cross-repo work (editing the linked project pages themselves)

Each hub card links to a **separate sibling repo/site**, not a path inside this repo. One example so far: a small "← 허브" mobile-only back-link was added to every linked project's live page (since hub cards open with `target="_blank"`, so mobile back-gesture doesn't return to the hub). Lessons from doing that across ~16 repos:

- **Most linked repos aren't cloned locally.** Only `field2scene`, `ebs-learning`, `podcast`, `portfolio` exist under `c:/coding/github-repository/`. Everything else needs `git clone` from `github.com/leeyunhome/<repo>` — `gh` CLI isn't installed in this environment, so plain HTTPS clone (credentials are already cached, push works without re-auth).
- **A local folder's name doesn't tell you its remote.** The local `podcast/` folder's `origin` actually points at `goodmorningpops_podcast` (the deploy repo the hub links to) — they're the same remote, not two separate repos. Check `git remote -v` before assuming a local checkout is unrelated to a repo you're about to clone fresh; editing both without realizing they're the same remote causes a non-fast-forward push.
- **A local checkout isn't always the source of truth.** `ebs-learning/` locally had only `README.md` tracked in git (`git ls-files`) — all the episode HTML/mp3/json files sitting in that folder are untracked local artifacts, not what's actually deployed. Clone fresh from GitHub instead of trusting what's on disk when a local folder looks incomplete relative to the live site.
- **Entry point location varies per repo** — usually root `index.html`, but `data-visualization-playbook`'s Pages source is `docs/index.html`. Check before assuming root.
- **`portfolio` is MkDocs Material** (`mkdocs.yml`, `mkdocs gh-deploy` via `.github/workflows/pages.yml`) — its `site/` output is gitignored and rebuilt by CI, so you can't hand-edit generated HTML. Site-wide additions (like the back-link) go through `extra_javascript` in `mkdocs.yml` pointing at a file under `docs/javascripts/`.
- **`field2scene` has no deployed Pages site** — the hub links to its `github.com` repo page directly, so there's no live HTML to add a back-link to.
- Large-asset repos (e.g. `splatting-viewer` has ~470MB of `.ply` model files) make a full clone slow/large just to edit one HTML file — acceptable for a one-off edit-and-delete, but don't keep these clones around after pushing.

## Legacy files — do not extend

Everything else (`_config.yml`, `_includes/`, `_layouts/`, `_data/`, `_plugins/`, `js/`, `img/`, `feed.xml`, `style.css`) is leftover from a forked Jekyll book-site template ("Prompt Engineering" by needleworm). `_config.yml` still points at the original author's URL/email. These files are unused by the current hub page; don't wire new work into the Jekyll structure — edit `index.html` directly.

## Verifying changes

No build or test commands. Open `index.html` directly in a browser (or `python -m http.server`) to preview.
