# Extraction of Indian Cultural Elements Using RAG

Flora and fauna in eight Indian literary texts, what a small RAG pipeline (AnythingLLM with Gemma 3 4B in LM Studio) said was there, and a word-for-word check of every answer against the full text of each book.

**Author:** Simanta Nandi, MA, Digital Humanities and Social Sciences, Indian Institute of Technology (Indian School of Mines) Dhanbad  
**Semester:** Monsoon Semester 2026  
**Supervision:** Shanmugapriya T and Sourav Ghosh  
**Licence:** CC BY-NC 4.0 (see `LICENSE`)  
**Repository:** https://github.com/SimantaDH/rag  
**Website:** https://simantadh.github.io/rag/

## What is in this repository

Every file sits at the top level, so GitHub Pages can serve the site straight from the root.

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The project website |
| `data.js` | All results used by the website (entities, quotations, audit) |
| `flora_fauna.py` | The assignment file: verified flora and fauna for all eight texts in the ten categories, text by text, with evidence |
| `rag_pipeline.py` | Rebuilds the chunking and top-4 retrieval, sends a prompt to LM Studio, and checks quotations |
| `prompt.md` | The extraction prompt used in AnythingLLM |
| `gitanjali.txt`, `ancient_ballads.txt`, `jungle_book.txt`, `golden_threshold.txt`, `glimpses_of_bengal.txt`, `sakoontala.txt` | The six Project Gutenberg texts with the Gutenberg header and licence removed |
| `bird_of_time.txt` | The Bird of Time, from the Wikisource text in *Literature of Colonial South Asia* (Lehigh University) |
| `allm-*.png` | Screenshots of the AnythingLLM workspace settings |
| `simanta-nandi.jpg`, `favicon.svg` | Images |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

Line numbers on the website refer to these cleaned `.txt` files.

*The Adivasi Will Not Dance* (Hansda Sowvendra Shekhar, Speaking Tiger, 2015) is in copyright. It was checked from a text file supplied for the project, but that file is **not** in this repository. The website and `flora_fauna.py` quote it only briefly, for criticism and review.

## Publish the website on GitHub Pages

1. Upload every file in this folder to the root of https://github.com/SimantaDH/rag ("Add file > Upload files"). Make sure `.nojekyll` is included. On some systems you need to show hidden files to see it.
2. In the repository go to **Settings > Pages**, choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. After a minute or two the site is live at https://simantadh.github.io/rag/.

The GitHub link and the Pages address are already set at the top of `app.js`. The site also works if you simply open `index.html` from your computer.

## Run the Python files

Both files use only the Python standard library (Python 3.8 or later).

```bash
python flora_fauna.py                                 # category totals for the corpus and each text
python rag_pipeline.py ask jungle_book                # sends the prompt and 4 chunks to LM Studio (port 1234)
python rag_pipeline.py verify answer.md jungle_book   # checks every quotation in a saved model answer
python rag_pipeline.py experiment                     # optional: how many verified names the top 4 chunks hold
```

## Sources

Project Gutenberg (https://www.gutenberg.org), plain text: Gitanjali (#7164), Ancient Ballads and Legends of Hindustan (#23245), The Jungle Book (#236), The Golden Threshold (#680), Glimpses of Bengal (#7951) and Sakoontala; or, The Lost Ring (#12169).

Sarojini Naidu, *The Bird of Time: Songs of Life, Death & the Spring* (1912), in Amardeep Singh, ed., *Literature of Colonial South Asia: A Digital Archive*, Lehigh University: https://scalar.lehigh.edu/literature-of-colonial-south-asia/sarojini-naidu-the-bird-of-time-songs-of-life-death--the-spring-1912-full-text

Hansda Sowvendra Shekhar, *The Adivasi Will Not Dance: Stories* (New Delhi: Speaking Tiger, 2015).

## Cite

Nandi, S. (2026). *Extraction of Indian cultural elements using RAG: Flora and fauna in Indian literary texts* [Project website]. Department of Humanities and Social Sciences, Indian Institute of Technology (Indian School of Mines) Dhanbad. https://simantadh.github.io/rag/
