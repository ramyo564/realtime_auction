# Realtime Auction Portfolio Package

This folder contains a standalone dashboard package for `realtime_auction`.

## Files
- `index.html`: dashboard layout
- `style.css`: responsive styles
- `script.js`: renderer and mermaid interactions
- `config.js`: section/card content model
- `diagrams.js`: mermaid source map
- `learnmore-links.js`: card -> README anchor map

## Mapping rules
- Card `mermaidId` must exist in all three places:
1. `config.js`
2. `diagrams.js`
3. `learnmore-links.js`

- Hero/top panel `diagramId` must exist in `diagrams.js`.

## Learn More rules
- All links target `Readme.md` anchors (`lm-*`).
- Those anchors must exist in `realtime_auction/Readme.md`.
