#!/usr/bin/env python3
"""
Translate pages_ne.json (Nepali) → pages_en.json (English)
Uses deep_translator with Google Translate backend (free, no API key).

Usage:
  pip3 install deep-translator
  python3 translate.py [--start 0] [--end 907] [--batch 50]

The script saves progress incrementally so you can resume if interrupted.
"""

import json
import time
import argparse
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "src" / "data"

def translate_pages(start=0, end=None, batch_size=50, delay=1.5):
    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        print("ERROR: deep-translator not installed. Run: pip3 install deep-translator")
        return

    in_path = DATA_DIR / "pages_ne.json"
    out_path = DATA_DIR / "pages_en.json"

    with open(in_path, "r", encoding="utf-8") as f:
        pages_ne = json.load(f)

    # Load existing translations if resuming
    pages_en = []
    if out_path.exists():
        with open(out_path, "r", encoding="utf-8") as f:
            pages_en = json.load(f)
        print(f"Resuming: {len(pages_en)} pages already translated")

    translated_pages = {p["page"]: p for p in pages_en}
    translator = GoogleTranslator(source='ne', target='en')

    if end is None:
        end = len(pages_ne)

    total = end - start
    done = 0

    for i in range(start, end):
        page_data = pages_ne[i]
        page_num = page_data["page"]

        if page_num in translated_pages:
            done += 1
            continue

        text = page_data["text"]

        if not text.strip():
            translated_pages[page_num] = {"page": page_num, "text": ""}
            done += 1
            continue

        try:
            # Google Translate has a ~5000 char limit per request
            if len(text) > 4500:
                # Split into chunks and translate separately
                chunks = []
                words = text.split('\n')
                current = ""
                for w in words:
                    if len(current) + len(w) + 1 < 4500:
                        current += w + "\n"
                    else:
                        if current:
                            chunks.append(current.strip())
                        current = w + "\n"
                if current:
                    chunks.append(current.strip())

                translated_chunks = []
                for chunk in chunks:
                    if chunk.strip():
                        t = translator.translate(chunk)
                        translated_chunks.append(t)
                        time.sleep(0.3)
                translated_text = "\n".join(translated_chunks)
            else:
                translated_text = translator.translate(text)

            translated_pages[page_num] = {"page": page_num, "text": translated_text}
            done += 1

            if done % 10 == 0:
                print(f"  Progress: {done}/{total} (page {page_num})")
                # Save progress
                sorted_pages = sorted(translated_pages.values(), key=lambda x: x["page"])
                with open(out_path, "w", encoding="utf-8") as f:
                    json.dump(sorted_pages, f, ensure_ascii=False, indent=2)

            # Rate limiting
            time.sleep(delay)

        except Exception as e:
            print(f"  Error on page {page_num}: {e}")
            time.sleep(5)  # back off on error
            continue

    # Final save
    sorted_pages = sorted(translated_pages.values(), key=lambda x: x["page"])
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(sorted_pages, f, ensure_ascii=False, indent=2)

    print(f"Translation complete: {len(sorted_pages)} pages saved to {out_path}")


def main():
    parser = argparse.ArgumentParser(description="Translate Nepali PDF pages to English")
    parser.add_argument("--start", type=int, default=0, help="Start page index (0-based)")
    parser.add_argument("--end", type=int, default=None, help="End page index (exclusive)")
    parser.add_argument("--batch", type=int, default=50, help="Batch size")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between requests (seconds)")
    args = parser.parse_args()

    print(f"Translating pages {args.start} to {args.end or 'end'}...")
    translate_pages(args.start, args.end, args.batch, args.delay)


if __name__ == "__main__":
    main()
