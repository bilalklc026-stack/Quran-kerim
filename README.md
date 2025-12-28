# Quran-kerim

This repository provides a Quran viewer web page (index.html, script.js, style.css and JSON data files).

Changes applied on 2025-12-28:

- Replaced `pages604.json` with a valid placeholder because the previous file was malformed and caused page ordering issues.
- `script.js` builds page order dynamically from `quran.json` using `PAGE_SIZE = 10`, so pages are ordered according to the Qur'an (chapter and verse order).
- The site UI has four menu bands: Sayfalar, Sureler, Cüzler, Ayetler (as present in `index.html`).

How it works:

- `script.js` flattens `quran.json` into a global verse list in Qur'an order and computes page numbers using `PAGE_SIZE` (default 10). This ensures consistent, Qur'an-ordered pages regardless of any external page mapping file.

If you want a full static page->verse mapping file generated, I can produce and commit it on request (it will be large).
