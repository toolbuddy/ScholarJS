# ScholarJS

ScholarJS is a JavaScript module that implements a querier and parser for Google Scholar's output. Its classes can be used independently, but it can also be invoked as a command-line tool.

---
## Features

* Extracts publication title, most relevant web link, PDF link, number of citations, number of online versions, link to Google Scholar's article cluster for the work, Google Scholar's cluster of all works referencing the publication, and excerpt of content.
* Extracts total number of hits as reported by Scholar
* Supports the full range of advanced query options provided by Google Scholar, such as title-only search, publication date timeframes, and inclusion/exclusion of patents and citations.
* Supports article cluster IDs, i.e., information relating to the variants of an article already identified by Google Scholar
* Supports retrieval of citation details in standard external formats as provided by Google Scholar, including BibTeX and EndNote.
* Command-line tool prints entries in CSV format, simple plain text, or in the citation export format.

---
## Notes

I will always strive to add features that increase the power of this API, but I will never add features that intentionally try to work around the query limits imposed by Google Scholar. Please don't ask me to add such features.

---
## Examples

Try `node main.js --help` for all available options. Note, the command line arguments changed considerably in version 2.0! A few examples:

---
## Author

* [Yung-Sheng Lu](https://yungshenglu.github.io/)

## Member

* [Kevin Cyu](https://kevinbird61.github.io/Intro/)