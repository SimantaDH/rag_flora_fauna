"""
============================================================
Topic: Extraction of Indian Cultural Elements Using RAG
File : rag_pipeline.py  (companion to flora_fauna.py)
============================================================
Author Name(s): Simanta Nandi
Semester: Monsoon Semester 2026
Affiliation: MA, Digital Humanities and Social Sciences, Indian Institute
    of Technology (Indian School of Mines) Dhanbad
Licence: CC BY-NC 4.0
============================================================

What this script does
---------------------
It rebuilds, step by step, the retrieval-augmented generation (RAG) set-up
used in class with AnythingLLM. It then uses the same steps to test that
set-up. Nothing here needs the internet, and only the Python standard
library is required.

    1. LOAD      read the cleaned .txt files (the repository)
    2. CHUNK     split each book into 1,000-character pieces with a
                 20-character overlap (the AnythingLLM defaults)
    3. INDEX     score every chunk against a query (BM25 here; AnythingLLM
                 uses dense vectors, but the logic of "top-k" is the same)
    4. RETRIEVE  keep the top 4 chunks above a minimum score, as in the
                 workspace settings (Max Context Snippets = 4)
    5. GENERATE  optional: send the chunks and the prompt to a local model
                 through LM Studio (OpenAI-compatible server, gemma-3-4b)
    6. VERIFY    check every quotation in a model answer word for word
                 against the full text, and measure how much of the gold
                 list (flora_fauna.py) the four chunks could ever contain

Usage
-----
    python rag_pipeline.py experiment                # retrieval-ceiling test, all books
    python rag_pipeline.py ask jungle_book           # needs LM Studio running on :1234
    python rag_pipeline.py verify answer.md jungle_book   # check quotations in a saved answer

Put the corpus files (gitanjali.txt, ancient_ballads.txt, ...) and
prompt.md in the same folder as this script, or pass --dir. A book whose
file is missing is skipped. The Adivasi Will Not Dance is in copyright,
so adivasi.txt is not shared in the repository; add your own copy.
"""
import argparse
import json
import math
import os
import re
import sys
import urllib.request
from collections import Counter

# ----------------------------------------------------------------------------
# Settings copied from the AnythingLLM workspaces shown in the screenshots
# ----------------------------------------------------------------------------
CHUNK_SIZE = 1000          # characters (AnythingLLM text splitter default)
CHUNK_OVERLAP = 20         # characters
TOP_K = 4                  # "Max Context Snippets"
MIN_SCORE = 0.25           # "Document similarity threshold: Low (>= .25)", applied to normalised scores
TEMPERATURE = 0.1          # 0.2 for the Gitanjali workspace
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"
MODEL = "google/gemma-3-4b"
SYSTEM_PROMPT = ("Given the following conversation, relevant context, and a follow up question, "
                 "reply with an answer to the current question the user is asking. Return only your "
                 "response to the question given the above information following the users instructions as needed.")

BOOKS = {
    "gitanjali": "Gitanjali (Rabindranath Tagore)",
    "ancient_ballads": "Ancient Ballads and Legends of Hindustan (Toru Dutt)",
    "jungle_book": "The Jungle Book (Rudyard Kipling)",
    "bird_of_time": "The Bird of Time (Sarojini Naidu)",
    "golden_threshold": "The Golden Threshold (Sarojini Naidu)",
    "glimpses_of_bengal": "Glimpses of Bengal (Rabindranath Tagore)",
    "adivasi": "The Adivasi Will Not Dance (Hansda Sowvendra Shekhar)",
    "sakoontala": "Sakoontala; or, The Lost Ring (Kalidasa, trans. Monier-Williams)",
}

CATEGORY_QUERIES = {
    "Trees": "trees tree forest grove banyan peepul neem mango palm",
    "Plants": "plants grass reeds creeper shrub bush weed moss",
    "Flowers": "flowers flower lotus lily rose jasmine blossom",
    "Herbs": "herb herbs sacred grass medicinal leaves ointment",
    "Crops": "crops fields rice corn grain wheat millet harvest",
    "Mammals": "elephant tiger deer cow dog monkey bear wolf",
    "Birds": "birds bird crow peacock parrot koel dove kite",
    "Reptiles": "snake serpent cobra python lizard turtle",
    "Fish": "fish river pond carp fishing",
    "Insects": "bee bees butterfly firefly ant fly insect",
}

TOKEN = re.compile(r"[a-zà-ÿ']+")


# ----------------------------------------------------------------------------
# 1-2. Load and chunk
# ----------------------------------------------------------------------------
def load_text(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def chunk_text(text, size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split text into overlapping character windows, preferring to cut at a space."""
    chunks, start = [], 0
    while start < len(text):
        end = min(start + size, len(text))
        if end < len(text):
            cut = text.rfind(" ", start + size // 2, end)
            end = cut if cut > 0 else end
        chunks.append({"start": start, "end": end, "text": text[start:end]})
        if end >= len(text):
            break
        start = max(end - overlap, start + 1)
    return chunks


# ----------------------------------------------------------------------------
# 3. A small BM25 index (stand-in for the vector database)
# ----------------------------------------------------------------------------
class BM25:
    def __init__(self, docs, k1=1.5, b=0.75):
        self.k1, self.b = k1, b
        self.docs = [Counter(TOKEN.findall(d.lower())) for d in docs]
        self.lens = [sum(d.values()) for d in self.docs]
        self.avg = sum(self.lens) / max(1, len(self.lens))
        df = Counter()
        for d in self.docs:
            df.update(d.keys())
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def score(self, query):
        q = Counter(TOKEN.findall(query.lower()))
        out = []
        for d, ln in zip(self.docs, self.lens):
            s = 0.0
            for t in q:
                if t in d:
                    tf = d[t]
                    s += self.idf[t] * tf * (self.k1 + 1) / (tf + self.k1 * (1 - self.b + self.b * ln / self.avg))
            out.append(s)
        return out


def retrieve(index, chunks, query, k=TOP_K, min_score=MIN_SCORE):
    """Return the top-k chunks whose normalised score passes the threshold."""
    scores = index.score(query)
    top = max(scores) or 1.0
    ranked = sorted(range(len(chunks)), key=lambda i: -scores[i])
    return [dict(chunks[i], score=round(scores[i] / top, 3)) for i in ranked[:k] if scores[i] / top >= min_score]


# ----------------------------------------------------------------------------
# 5. Optional generation through LM Studio
# ----------------------------------------------------------------------------
def generate(context_chunks, user_prompt, temperature=TEMPERATURE):
    context = "\n\n".join(f"[CONTEXT {i}]:\n{c['text']}\n[END CONTEXT {i}]" for i, c in enumerate(context_chunks))
    body = {
        "model": MODEL,
        "temperature": temperature,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT + "\nContext:\n" + context},
            {"role": "user", "content": user_prompt},
        ],
    }
    req = urllib.request.Request(LM_STUDIO_URL, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.loads(r.read())["choices"][0]["message"]["content"]


# ----------------------------------------------------------------------------
# 6. Verification helpers
# ----------------------------------------------------------------------------
def _norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"').lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9à-ÿ' ]+", " ", s)).strip()


def verify_quotes(answer_text, source_text):
    """Find every quoted string in a model answer and test it against the full text."""
    src = _norm(source_text)
    quotes = re.findall(r"[“\"]([^”\"]{12,400})[”\"]", answer_text)
    report = []
    for q in quotes:
        report.append({"quote": q, "found_in_text": _norm(q) in src})
    return report


def gold_entities(book_short_name):
    """Read the verified list for one book from flora_fauna.py."""
    import flora_fauna as ff
    return [e for e in ff.EVIDENCE if e["text"] == book_short_name and e["status"] == "Verified"]


SHORT = {"gitanjali": "Gitanjali", "ancient_ballads": "Ancient Ballads", "jungle_book": "The Jungle Book",
         "bird_of_time": "The Bird of Time", "golden_threshold": "The Golden Threshold",
         "glimpses_of_bengal": "Glimpses of Bengal", "adivasi": "The Adivasi Will Not Dance", "sakoontala": "Sakoontala"}


def reachable(entity, chunks):
    """True if any written form of the entity appears inside the retrieved chunks."""
    text = " ".join(c["text"] for c in chunks)
    for form in entity["name_as_written"].split(" / "):
        if re.search(r"(?<![A-Za-zÀ-ÿ])" + re.escape(form) + r"(?![A-Za-zÀ-ÿ])", text, re.I):
            return True
    return False


def experiment(folder):
    prompt = load_text(os.path.join(folder, "prompt.md"))
    results = {}
    for key, title in BOOKS.items():
        path = os.path.join(folder, key + ".txt")
        if not os.path.exists(path):
            continue
        text = load_text(path)
        chunks = chunk_text(text)
        index = BM25([c["text"] for c in chunks])
        gold = gold_entities(SHORT[key])
        one = retrieve(index, chunks, prompt)                      # what the class set-up does: one query, 4 snippets
        many = []
        for q in CATEGORY_QUERIES.values():                        # ten targeted queries, 4 snippets each
            for c in retrieve(index, chunks, q):
                if c["start"] not in {m["start"] for m in many}:
                    many.append(c)
        seen_one = sum(len(c["text"]) for c in one) / len(text)
        seen_many = sum(len(c["text"]) for c in many) / len(text)
        r_one = sum(reachable(e, one) for e in gold) / max(1, len(gold))
        r_many = sum(reachable(e, many) for e in gold) / max(1, len(gold))
        results[key] = {"title": title, "chunks": len(chunks), "gold_verified": len(gold),
                        "single_query": {"snippets": len(one), "share_of_text": round(seen_one, 4), "ceiling_recall": round(r_one, 3)},
                        "ten_queries": {"snippets": len(many), "share_of_text": round(seen_many, 4), "ceiling_recall": round(r_many, 3)}}
        print(f"{title[:44]:<44} chunks {len(chunks):>4} | 1 query: {seen_one:6.1%} of text, "
              f"ceiling {r_one:6.1%} | 10 queries: {seen_many:6.1%} of text, ceiling {r_many:6.1%}")
    with open(os.path.join(folder, "retrieval_experiment.json"), "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=1)
    return results


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=["experiment", "ask", "verify"])
    ap.add_argument("args", nargs="*")
    ap.add_argument("--dir", default=os.path.dirname(os.path.abspath(__file__)))
    a = ap.parse_args()
    sys.path.insert(0, a.dir)
    if a.command == "experiment":
        experiment(a.dir)
    elif a.command == "ask":
        book = a.args[0]
        text = load_text(os.path.join(a.dir, book + ".txt"))
        chunks = chunk_text(text)
        prompt = load_text(os.path.join(a.dir, "prompt.md"))
        ctx = retrieve(BM25([c["text"] for c in chunks]), chunks, prompt)
        answer = generate(ctx, prompt)
        print(answer)
        print("\n--- quotation check ---")
        for r in verify_quotes(answer, text):
            print(("FOUND   " if r["found_in_text"] else "MISSING ") + r["quote"][:90])
    elif a.command == "verify":
        answer = load_text(a.args[0])
        text = load_text(os.path.join(a.dir, a.args[1] + ".txt"))
        for r in verify_quotes(answer, text):
            print(("FOUND   " if r["found_in_text"] else "MISSING ") + r["quote"][:90])


if __name__ == "__main__":
    main()
