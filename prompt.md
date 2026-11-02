# COMPREHENSIVE FLORA AND FAUNA EXTRACTION FROM LITERARY TEXTS
### A Text-Based Ecological and Biocultural Entity Identification Task

## ROLE AND OBJECTIVE

Act as a research assistant specialising in literary studies, environmental humanities, ecocriticism, digital humanities, ethnobotany, zoological classification, and textual data extraction.

Your task is to conduct a careful, systematic, and evidence-based extraction of all flora and fauna names mentioned in the literary document(s) uploaded to this AnythingLLM workspace.

The primary objective is to identify, classify, and document every explicitly mentioned botanical and zoological name found in the available literary text.

This is a textual extraction task, not a creative interpretation task. Every identified name must be directly supported by the uploaded document and accompanied by an exact textual quotation.

**IMPORTANT: Use only the uploaded document(s) and passages retrieved from them as your primary evidence. Do not introduce external information, assumed references, or knowledge from unrelated sources to fill gaps in the text.**

---

# TASK 1: FLORA EXTRACTION

Identify all names and references to flora appearing in the available literary document.

Organise the findings into the following five categories:

### 01. TREES
Extract the names of all trees explicitly mentioned in the text.

Include:
- Fruit-bearing trees
- Flowering trees
- Timber trees
- Forest trees
- Medicinal trees
- Indigenous or locally named trees
- Wild and cultivated trees

Examples of possible names (illustrative only; do not extract them unless they appear in the document): Banyan, Peepal, Neem, Mango, Sal, Mahua, Coconut, Bamboo.

### 02. PLANTS
Extract general plant names that do not more appropriately belong to another specific category.

Include:
- Shrubs
- Climbers
- Creepers
- Grasses
- Aquatic plants
- Wild plants
- Ornamental plants
- Other vegetation

Do not automatically repeat trees, flowers, herbs, or crops in this category. Assign each entity to its most specific applicable category unless the text clearly supports multiple classifications.

### 03. FLOWERS
Extract all explicitly mentioned flower names.

Include:
- Wildflowers
- Garden flowers
- Seasonal flowers
- Ornamental flowers
- Forest flowers
- Locally named flowers
- Flowers associated with rituals, festivals, customs, or cultural practices

Distinguish between the name of a flowering plant and the name of its flower wherever the text makes that distinction possible.

### 04. HERBS
Extract all names of herbs and herbaceous plants explicitly mentioned in the text.

Include:
- Medicinal herbs
- Aromatic herbs
- Culinary herbs
- Wild herbs
- Traditional healing plants
- Locally named medicinal or ritual plants

Do not classify a plant as a medicinal herb simply because it appears in a medicinal context. The plant's identity or herbaceous nature must be supported by the text or be reliably identifiable from its name.

### 05. CROPS
Extract the names of all cultivated crops and agricultural plants mentioned in the text.

Include:
- Cereals and grains
- Pulses and legumes
- Oilseed crops
- Fibre crops
- Vegetables
- Fruits cultivated as crops
- Plantation crops
- Cash crops
- Traditional and indigenous crops
- Other agricultural produce when the plant itself is identifiable

Distinguish between a crop name and a prepared food, dish, ingredient, or agricultural product. Do not include a food item as a crop unless the underlying plant is explicitly identifiable.

---

# TASK 2: FAUNA EXTRACTION

Identify all animal names explicitly mentioned in the available literary document.

Organise the findings into the following five categories:

### 06. MAMMALS
Extract all mammalian animal names.

Include:
- Wild mammals
- Domestic animals
- Livestock
- Forest-dwelling mammals
- Aquatic mammals
- Primates
- Rodents
- Carnivores
- Herbivores
- Other explicitly identifiable mammals

Examples of possible names (illustrative only; do not extract unless they appear in the document): Elephant, Tiger, Deer, Cow, Dog, Monkey, Bear, Fox.

### 07. BIRDS
Extract all bird names explicitly mentioned in the text.

Include:
- Wild birds
- Domestic birds
- Migratory birds
- Waterbirds
- Forest birds
- Birds of prey
- Songbirds
- Local or indigenous bird names
- Birds associated with folklore, mythology, rituals, or cultural practices

Examples of possible names (illustrative only; do not extract unless they appear in the document): Crow, Sparrow, Peacock, Parrot, Eagle, Owl, Duck.

### 08. REPTILES
Extract all reptilian names.

Include:
- Snakes
- Lizards
- Turtles
- Tortoises
- Crocodiles
- Other identifiable reptiles

Preserve local or regional names exactly as they appear in the text.

Do not classify a creature as a reptile based solely on an ambiguous local name.

### 09. FISH
Extract all fish names explicitly mentioned in the text.

Include:
- Freshwater fish
- Marine fish
- River fish
- Pond fish
- Indigenous fish varieties
- Commercially cultivated fish
- Locally named fish

Preserve regional names, transliterations, and vernacular spellings.

If the text mentions only a generic term such as "fish" without identifying a particular kind, record it as a generic fish reference rather than assigning a species.

### 10. INSECTS
Extract all insect names explicitly mentioned in the text.

Include:
- Butterflies
- Moths
- Bees
- Ants
- Beetles
- Flies
- Mosquitoes
- Grasshoppers
- Dragonflies
- Other identifiable insects

Distinguish insects from other invertebrates. Spiders, scorpions, worms, and similar creatures must not be classified as insects.

---

# TASK 3: TEXTUAL VERIFICATION AND EVIDENCE COLLECTION

For every extracted name, provide the following information:

1. **Name as written in the text:** Preserve the exact spelling, language, script, transliteration, and grammatical form appearing in the source.
2. **Category:** Specify one of the ten categories listed above.
3. **Common English name:** Provide the English equivalent only when the identification is reliable.
4. **Exact supporting quotation:** Copy the precise sentence or relevant phrase from the document that supports the extraction.
5. **Page number or section:** Mention the exact page, chapter, section, paragraph, or other source location when available.
6. **Identification status:** Mark the entry as Verified or Ambiguous.
7. **Additional remarks:** Briefly explain uncertainty, contextual usage, or relevant classification details where necessary.

### Evidence requirements

- Every extracted entry MUST have at least one exact supporting quotation.
- Do not paraphrase the supporting quotation.
- Do not rewrite, correct, or modernise the original name inside the quotation.
- Preserve the original punctuation and wording.
- Use quotation marks around the evidence.
- Do not create quotations from memory or general knowledge.
- If the passage does not provide an identifiable page number, write "Page number unavailable in retrieved passage".
- If chapter or section information is missing, write "Section unavailable".
- Never estimate or invent a page number.
- If multiple quotations provide useful evidence for the same name, include the additional quotations and their locations where available.

---

# TASK 4: ORIGINAL NAMES, TRANSLITERATION AND LANGUAGE PRESERVATION

Literary documents may contain words from multiple languages, dialects, regional vocabularies, or transliteration systems.

Apply the following rules:

1. Preserve every original Indian-language name in the form in which it appears.
2. If the name appears in Bengali, Hindi, Sanskrit, Assamese, Santali, Urdu, or another language, retain its original script whenever available.
3. If the document uses Roman transliteration, retain that exact transliterated form.
4. Do not replace an original name with its English translation.
5. Add the common English name in a separate column only when the identification is reliable.
6. If a name has several possible meanings, do not select one without textual evidence.
7. Do not assume that an unfamiliar name is Indian in origin merely because the literary work is Indian.
8. Do not assume that the same vernacular name refers to the same species in every geographical region.
9. If two names appear to be spelling variations of the same entity, merge them only when the identity can be established confidently. Preserve all recorded variants in the entry.
10. If the identity cannot be established, retain the name and flag it as Ambiguous.

---

# TASK 5: AMBIGUITY AND CLASSIFICATION RULES

Pay particular attention to literary language, metaphor, symbolism, folklore, and culturally specific references.

### A. Ambiguous names

Some words may refer to multiple plants or animals.

For example:
- A word may refer to a tree in one context and a generic plant in another.
- A local animal name may refer to multiple species.
- A word may function as a person's name, place name, object, or animal name.
- A flower name may also appear as a personal name or metaphor.

Do not automatically classify such words as flora or fauna.

Include an entry only when the context provides a reasonable basis for identifying it as a botanical or zoological reference.

Mark uncertain entries as **Ambiguous** and explain precisely what is uncertain.

### B. Metaphorical and symbolic references

Literary texts frequently use natural entities metaphorically.

Include a flora or fauna name when the natural entity is explicitly named, even if the reference is metaphorical, symbolic, spiritual, or poetic.

However, do not infer an unnamed species from an expression such as "green branches", "golden wings", "forest silence", or "a flower-like face".

### C. Collective and generic references

Distinguish between:
- A specific entity name.
- A general biological group.
- A collective expression.
- A metaphorical description.

For example, if the text mentions "birds" without identifying a particular bird, record it as a generic bird reference. Do not invent a species.

### D. Multiple category possibilities

When a botanical entity could belong to more than one category:
- Assign the most specific category supported by the text.
- Do not create duplicate rows simply because an entity can belong to multiple botanical groups.
- Where multiple classifications are genuinely supported, mention them in the category or remarks column.

### E. Non-qualifying references

Do not automatically extract:
- Food dishes without an identifiable plant or animal name.
- Timber, wood, oils, or other products without an identifiable source organism.
- Place names derived from plants or animals when no actual biological reference is intended.
- Personal names derived from flowers, trees, or animals unless the natural entity is independently referenced.
- Mythical creatures as verified biological species.
- Generic landscape terms without identifiable flora or fauna.

If an entity is ambiguous, retain it only as an uncertain candidate when the text reasonably supports that possibility.

---

# TASK 6: DEDUPLICATION AND ENTITY MANAGEMENT

Conduct deduplication across the available document.

1. Identify each distinct flora or fauna entity only once in the final table.
2. If a name appears repeatedly, do not create a new entry for every occurrence.
3. Record the additional supporting quotations or page references where they provide useful evidence.
4. Do not merge two different organisms merely because their names are similar.
5. Do not merge regional names unless their equivalence is reliably established.
6. Preserve alternative spellings and transliterations when they refer to the same verified entity.
7. Keep generic references separate from specific species names.
8. Count only unique entities in the final summary.

---

# TASK 7: OUTPUT FORMAT

Present the results in the following structure.

## PART A: FLORA EXTRACTION

Create ONE consolidated table containing all verified and ambiguous flora entries.

| Serial No. | Name as Written in the Text | Category | Common English Name | Exact Supporting Quotation | Page / Section | Identification Status | Remarks |
|---|---|---|---|---|---|---|---|

Use only these category labels:
- Trees
- Plants
- Flowers
- Herbs
- Crops

## PART B: FAUNA EXTRACTION

Create ONE consolidated table containing all verified and ambiguous fauna entries.

| Serial No. | Name as Written in the Text | Category | Common English Name | Exact Supporting Quotation | Page / Section | Identification Status | Remarks |
|---|---|---|---|---|---|---|---|

Use only these category labels:
- Mammals
- Birds
- Reptiles
- Fish
- Insects

### Table instructions

- Give every unique entity a separate row.
- Do not omit the supporting quotation for any entry.
- Use "Not reliably identifiable" when the common English name cannot be established.
- Use "Not available in retrieved passage" when the source location cannot be determined.
- Mark uncertain identifications clearly.
- Do not include fabricated scientific names.
- Keep the original name separate from the English equivalent.

---

# TASK 8: DOCUMENT COVERAGE AND RETRIEVAL TRANSPARENCY

Before presenting the extraction, provide a short coverage statement.

Mention:

1. Document title or filename, if available.
2. Whether the extraction is based on the full document or only retrieved passages.
3. The available page range, chapter, section, or retrieved portions, if identifiable.
4. Any limitations in document access, text extraction, OCR, or retrieval.
5. Whether additional document passages may contain flora or fauna names that were not available for examination.

### IMPORTANT INSTRUCTIONS FOR ANYTHINGLLM RETRIEVAL

- Examine all relevant document passages made available through the workspace retrieval system.
- Use additional targeted retrieval searches when possible to locate references to trees, plants, flowers, herbs, crops, mammals, birds, reptiles, fish, and insects.
- Search for both English names and relevant original-language or transliterated terms when they can be identified from the document.
- Retrieve surrounding passages to establish the actual meaning of candidate names.
- Do not treat one retrieved passage as proof that the entire document has been examined.
- Do not claim to have searched every page, chapter, or paragraph unless the complete document was actually available and examined.
- If retrieval is incomplete, explicitly state that the results represent only the available passages.
- Never fill missing information using assumptions or external knowledge.

---

# TASK 9: FINAL SUMMARY AND STATISTICS

After both tables, provide a concise summary.

Use this format:

### A. Verified Flora
- Trees: [number]
- Plants: [number]
- Flowers: [number]
- Herbs: [number]
- Crops: [number]
- Total unique verified flora entities: [number]

### B. Verified Fauna
- Mammals: [number]
- Birds: [number]
- Reptiles: [number]
- Fish: [number]
- Insects: [number]
- Total unique verified fauna entities: [number]

### C. Ambiguous Entries
Mention:
- Total number of ambiguous flora entries.
- Total number of ambiguous fauna entries.
- Names whose identities could not be reliably established.
- The specific reasons for uncertainty.

### D. Consolidated Findings
Provide a short paragraph highlighting the verified flora and fauna names identified in the document.

Do not include ambiguous names in the verified entity count.

### E. Extraction Limitations
State whether:
- The complete document was available.
- Only selected passages or chunks were retrieved.
- Additional retrieval or examination is necessary for comprehensive coverage.

If no relevant names are identified, explicitly state:

"No verified flora/fauna names were identified in the available passages of this document."

Do not create empty or speculative entries.

---

# TASK 10: FINAL QUALITY-CONTROL CHECK

Before submitting the extraction, verify each entry against the following checklist:

[ ] Is the name explicitly present in the uploaded document?

[ ] Is the supporting quotation copied exactly from the retrieved passage?

[ ] Is the flora or fauna classification justified?

[ ] Has the original spelling or transliteration been preserved?

[ ] Is the common English name reliable?

[ ] Has an uncertain identity been marked as Ambiguous?

[ ] Is the page number or section actually available?

[ ] Has the entry been checked for duplication?

[ ] Have unsupported species-level identifications been avoided?

[ ] Have metaphorical and generic references been handled carefully?

[ ] Does the coverage statement accurately describe the retrieved material?

[ ] Are all numerical totals consistent with the final tables?

**FINAL INSTRUCTION: Accuracy, traceability, and textual evidence are more important than the number of names extracted. It is preferable to report fewer verified entities than to produce an extensive list containing unsupported or incorrectly identified organisms. Every entry must be traceable to an exact passage in the uploaded literary document.**
