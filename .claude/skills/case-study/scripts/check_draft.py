#!/usr/bin/env python3
"""Mechanical checks for a case-study draft.

Usage:
    check_draft.py DRAFT.md [--source SOURCE.md] [--json]

Checks:
  - all 10 section ids are present (<!-- section: id -->)
  - every number in the draft also appears in the source (what the user said),
    ignoring numbers inside [[...]] placeholders, front-matter keys and years-as-ids
  - counts placeholders by kind (METRIC / ASK / IMAGE)
  - counts first-person "I" vs vague "we"
  - TL;DR length (sentences before "Key takeaways")
Exit code 1 if a section is missing or a number is untraceable.
"""
import json
import re
import sys

SECTIONS = ["summary", "context", "role", "research", "process",
            "setbacks", "tensions", "solution", "impact", "retro"]

NUM = re.compile(r"(?<![\w.])(\d+(?:[.,]\d+)?)(?:\s?(%|x|×|k|m|bn))?", re.I)
WORDS = {"one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6",
         "seven": "7", "eight": "8", "nine": "9", "ten": "10", "twelve": "12",
         "fifteen": "15", "twenty": "20", "thirty": "30", "forty": "40", "fifty": "50",
         "hundred": "100", "half": "50"}


def strip_placeholders(text):
    return re.sub(r"\[\[.*?\]\]", " ", text, flags=re.S)


def numbers(text):
    found = set()
    for m in NUM.finditer(text):
        n = m.group(1).replace(",", "")
        found.add(n.rstrip("0").rstrip(".") if "." in n else n)
    for w, d in WORDS.items():
        if re.search(r"\b" + w + r"\b", text, re.I):
            found.add(d)
    return found


def split_front_matter(text):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[3:end], text[end + 4:]
    return "", text


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    draft_path = argv[0]
    source_path = argv[argv.index("--source") + 1] if "--source" in argv else None
    as_json = "--json" in argv

    text = open(draft_path, encoding="utf-8").read()
    fm, body = split_front_matter(text)

    present = re.findall(r"<!--\s*section:\s*([a-z]+)\s*-->", text)
    missing = [s for s in SECTIONS if s not in present]
    out_of_order = [s for s in present if s in SECTIONS] != [s for s in SECTIONS if s in present]

    placeholders = {k: len(re.findall(r"\[\[" + k + r":", text)) for k in ("METRIC", "ASK", "IMAGE")}

    clean = strip_placeholders(body + "\n" + "\n".join(
        line.split(":", 1)[1] for line in fm.splitlines() if ":" in line))
    clean = re.sub(r"<!--.*?-->", " ", clean, flags=re.S)
    untraceable = []
    if source_path:
        src = open(source_path, encoding="utf-8").read()
        src_nums = numbers(src)
        for n in sorted(numbers(clean)):
            if n not in src_nums:
                untraceable.append(n)

    i_count = len(re.findall(r"\bI\b|\bI'(?:d|m|ve)\b|\bmy\b", body))
    we_count = len(re.findall(r"\bwe\b|\bour\b", body, re.I))

    tldr = ""
    m = re.search(r"<!--\s*section:\s*summary\s*-->(.*?)(\*\*Key takeaways|<!--\s*section:)", text, re.S)
    if m:
        tldr = re.sub(r"^#.*$", "", m.group(1), flags=re.M).strip()
    tldr_sentences = len([s for s in re.split(r"(?<=[.!?])\s+", strip_placeholders(tldr)) if s.strip()])

    report = {
        "sections_missing": missing,
        "sections_out_of_order": out_of_order,
        "placeholders": placeholders,
        "untraceable_numbers": untraceable,
        "first_person": i_count,
        "we_our": we_count,
        "tldr_sentences": tldr_sentences,
        "ok": not missing and not untraceable,
    }
    if as_json:
        print(json.dumps(report, indent=2))
    else:
        print("Sections: " + ("all 10 present" if not missing else "MISSING " + ", ".join(missing))
              + (" (out of order)" if out_of_order else ""))
        print("Placeholders: %(METRIC)d metric, %(ASK)d ask, %(IMAGE)d image" % placeholders)
        if source_path:
            print("Untraceable numbers: " + (", ".join(untraceable) if untraceable else "none"))
        print("Voice: %d I/my vs %d we/our" % (i_count, we_count))
        print("TL;DR sentences: %d" % tldr_sentences)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
