# Learning Checklist 💻📘

> A checklist with all the technologies and tools I want to learn for my web dev adventures.

## Building

`yarn build`

## Developing

`yarn start`

### List Definition Markup (.ldm)

The `pages.ldm` file contains the checklist data on LDM format.

The `ldm-parser.js` script parses files written on LDM format into javascript objects.

The `generate-pages.js` script uses that object to generate markdown files on the `./src/pages/` directory which are transpiled by parcel into html files. It also creates a `pages.txt` file with json data about the generated pages (parcel transforms json files into js files, someday I'll fix that).
