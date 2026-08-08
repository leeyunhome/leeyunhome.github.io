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

- Project cards live in `index.html` inside five tab panels (`#panel-graphics`, `#panel-tools`, `#panel-monitoring`, `#panel-embedded`, `#panel-ai`), switched by plain vanilla-JS click handlers on `.tab-btn` — no framework, no build step. Each card is an `<a class="card">` with icon, title, description, and tech `badge-*` spans (`badge-js`, `badge-ts`, `badge-py`, `badge-html`, `badge-ai`, `badge-css`).
- Category convention:
  - **그래픽스**: rendering/graphics-tech projects (3DGS viewer, cloth sim, image resizer).
  - **도구**: everyday utility apps with no AI model in the core pipeline and not a monitoring dashboard (PDF tool, counters, portfolio link, mini-games).
  - **모니터링 도구**: real-time monitoring/dashboard UIs (stock ticker dashboard, edge-device fleet control room) — split out once there were 2+ of these; don't re-fold them back into 도구.
  - **임베디드 시스템**: embedded/hardware-adjacent engineering work (device farm test automation, firmware/kernel tooling) — split out deliberately even while it holds a single card; the owner wants this as its own category going forward, don't fold it back into 도구.
  - **AI 활용 서비스**: an AI model/API is a load-bearing part of the pipeline (Whisper ASR, Gemini chat, Imagen generation) — not just "written with AI help".
- Design tokens (colors, radius) are CSS custom properties in `:root` — dark theme only.
- Keep AI badges accurate to what each project actually uses (this has been a source of past corrections — see commit history).

## Lessons learned (workflow gotchas)

- **A commit is not a deploy.** GitHub Pages only serves what's on `origin/main`. After committing, changes won't show on https://leeyunhome.github.io/ until `git push origin main` succeeds — if the user reports "I don't see the change," check `git status`/`git log` for unpushed commits before touching code.
- **`main` gets pushed to from elsewhere between sessions.** Other sessions/tools push directly to `main` outside this conversation (e.g. a "Add Cloth Lab card" commit landed while this session had local changes). Always `git fetch` and check `git log HEAD..origin/main` before pushing — a plain `git push` can get rejected (non-fast-forward), and multiple sessions editing the same card list in `index.html` produces real merge conflicts, not just fast-forwards. Resolve with `git pull --rebase origin main`, then manually reconcile the `<<<<<<</=======/>>>>>>>` markers card-by-card (don't just take one side — both sides usually added different cards).

## Legacy files — do not extend

Everything else (`_config.yml`, `_includes/`, `_layouts/`, `_data/`, `_plugins/`, `js/`, `img/`, `feed.xml`, `style.css`) is leftover from a forked Jekyll book-site template ("Prompt Engineering" by needleworm). `_config.yml` still points at the original author's URL/email. These files are unused by the current hub page; don't wire new work into the Jekyll structure — edit `index.html` directly.

## Verifying changes

No build or test commands. Open `index.html` directly in a browser (or `python -m http.server`) to preview.
