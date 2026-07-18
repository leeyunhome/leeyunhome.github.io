# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Personal GitHub Pages site served at https://leeyunhome.github.io/ — a project hub landing page linking to the owner's other GitHub Pages projects (portfolio, AI experiments, browser tools).

**The entire live site is the single self-contained [index.html](index.html)** — all CSS is inline in a `<style>` block, no JavaScript, no build step. Content is in Korean. Deployment is automatic: push to `main` and GitHub Pages serves it.

## Editing the hub page

- Project cards live in `index.html` under two `<section>` blocks: `🗂 포트폴리오` (Portfolio) and `🎮 취미` (Hobby). Each card is an `<a class="card">` with icon, title, description, and tech `badge-*` spans (`badge-js`, `badge-ts`, `badge-py`, `badge-html`, `badge-ai`, `badge-css`).
- Design tokens (colors, radius) are CSS custom properties in `:root` — dark theme only.
- Keep AI badges accurate to what each project actually uses (this has been a source of past corrections — see commit history).

## Legacy files — do not extend

Everything else (`_config.yml`, `_includes/`, `_layouts/`, `_data/`, `_plugins/`, `js/`, `img/`, `feed.xml`, `style.css`) is leftover from a forked Jekyll book-site template ("Prompt Engineering" by needleworm). `_config.yml` still points at the original author's URL/email. These files are unused by the current hub page; don't wire new work into the Jekyll structure — edit `index.html` directly.

## Verifying changes

No build or test commands. Open `index.html` directly in a browser (or `python -m http.server`) to preview.
