#!/usr/bin/env python3
"""
Extract text from Karki Aayog Pratibedan PDF.
Produces:
  - src/data/pages_ne.json  (page-by-page Nepali text)
  - src/data/structure.json (chapter/section hierarchy parsed from TOC pages)
"""

import json
import re
import fitz  # PyMuPDF
from pathlib import Path

PDF_PATH = Path(__file__).parent.parent.parent / "bhadra 23-24-karki-aayog-pratibedan.pdf"
DATA_DIR = Path(__file__).parent.parent / "src" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


def extract_pages(doc):
    """Extract text from every page."""
    pages = []
    for i, page in enumerate(doc):
        text = page.get_text().strip()
        pages.append({
            "page": i + 1,
            "text": text,
        })
        if (i + 1) % 100 == 0:
            print(f"  Extracted {i + 1}/{len(doc)} pages...")
    return pages


def parse_toc_line(line):
    """Parse a TOC line like '1.1. Some heading ........... 10' into (number, title, page)."""
    # Match patterns like: "1.1.", "पररच्िेद - 1", "भाग 1", etc.
    line = line.strip()
    if not line or len(line) < 5:
        return None
    # Find page number at the end (dots followed by number)
    m = re.search(r'[.\s]+(\d+)\s*$', line)
    if not m:
        return None
    page_num = int(m.group(1))
    title = re.sub(r'[.\s]+\d+\s*$', '', line).strip()
    title = re.sub(r'\.+', '', title).strip()
    if not title or len(title) < 3:
        return None
    # Determine level by indentation / numbering
    level = 1
    if re.match(r'^\d+\.\d+\.\d+', title):
        level = 3
    elif re.match(r'^\d+\.\d+', title):
        level = 2
    elif re.match(r'^[१२३४५६७८९०]+\.\d+', title):
        level = 2
    return {"title": title, "page": page_num, "level": level}


def parse_structure(pages_data):
    """Parse TOC pages (pages 4-9) to build chapter structure."""
    # Hardcoded structure based on TOC extracted earlier
    structure = {
        "parts": [
            {
                "id": "part-1",
                "title_ne": "भाग १: प्रारम्भिक",
                "title_en": "Part 1: Preliminary",
                "start_page": 1,
                "chapters": [
                    {
                        "id": "ch-1",
                        "number": "1",
                        "title_ne": "परिच्छेद - १: परिचय",
                        "title_en": "Chapter 1: Introduction",
                        "start_page": 1,
                        "sections": [
                            {"id": "1-1", "title_ne": "आयोग गठनको पृष्ठभूमि", "title_en": "Background of Commission Formation", "start_page": 1},
                            {"id": "1-2", "title_ne": "जेनजेड आन्दोलनको विकासक्रम र नेपालमा प्रभाव", "title_en": "Development of GenZ Movement and its Impact on Nepal", "start_page": 2},
                        ]
                    },
                    {
                        "id": "ch-2",
                        "number": "2",
                        "title_ne": "परिच्छेद - २: जाँचबुझ आयोगको गठन, काम, कर्तव्य, अधिकार र कार्यविधि",
                        "title_en": "Chapter 2: Commission Formation, Duties, Powers and Procedures",
                        "start_page": 16,
                        "sections": [
                            {"id": "2-1", "title_ne": "जाँचबुझ आयोगको गठन", "title_en": "Formation of Commission", "start_page": 16},
                            {"id": "2-2", "title_ne": "जाँचबुझ आयोगको संरचना", "title_en": "Structure of Commission", "start_page": 16},
                            {"id": "2-3", "title_ne": "आयोगको क्षेत्राधिकार र जिम्मेवारी", "title_en": "Jurisdiction and Responsibilities", "start_page": 16},
                            {"id": "2-4", "title_ne": "जाँचबुझ आयोगको कार्यप्रणाली", "title_en": "Working Methods", "start_page": 17},
                            {"id": "2-5", "title_ne": "जाँचबुझ आयोगको समयावधि र जनशक्ति", "title_en": "Timeline and Staff", "start_page": 17},
                            {"id": "2-6", "title_ne": "आयोगको कार्यविधि", "title_en": "Commission Procedures", "start_page": 17},
                        ]
                    },
                    {
                        "id": "ch-3",
                        "number": "3",
                        "title_ne": "परिच्छेद - ३: तथ्य तथा तथ्याङ्क संकलनमा प्रयोग गरिएका विधिहरु",
                        "title_en": "Chapter 3: Methods of Fact-Finding",
                        "start_page": 18,
                        "sections": [
                            {"id": "3-1", "title_ne": "स्थलगत अवलोकन तथा निरीक्षण विधि", "title_en": "Field Observation and Inspection", "start_page": 18},
                            {"id": "3-2", "title_ne": "प्रश्नोत्तर विधि", "title_en": "Questionnaire Method", "start_page": 19},
                            {"id": "3-3", "title_ne": "छलफल विधि", "title_en": "Discussion Method", "start_page": 19},
                            {"id": "3-4", "title_ne": "अन्तर्वार्ता विधि", "title_en": "Interview Method", "start_page": 19},
                            {"id": "3-5", "title_ne": "प्रमाण संकलन", "title_en": "Evidence Collection", "start_page": 19},
                        ]
                    },
                ]
            },
            {
                "id": "part-2",
                "title_ne": "भाग २: तथ्याङ्क संकलन",
                "title_en": "Part 2: Data Collection",
                "start_page": 22,
                "chapters": [
                    {
                        "id": "ch-4",
                        "number": "4",
                        "title_ne": "परिच्छेद - ४: मानवीय र भौतिक क्षतिको विवरण",
                        "title_en": "Chapter 4: Human and Physical Loss Details",
                        "start_page": 22,
                        "sections": [
                            {"id": "4-1", "title_ne": "मानवीय क्षतिको विवरण", "title_en": "Human Casualty Details", "start_page": 22},
                            {"id": "4-2", "title_ne": "भौतिक क्षति", "title_en": "Physical Damage", "start_page": 27},
                        ]
                    },
                    {
                        "id": "ch-5",
                        "number": "5",
                        "title_ne": "परिच्छेद - ५: बयान तथा घटना विवरण कागज र सरोकारवालाबाट प्राप्त सुझाव",
                        "title_en": "Chapter 5: Testimonies, Incident Reports and Stakeholder Suggestions",
                        "start_page": 28,
                        "sections": [
                            {"id": "5-1", "title_ne": "सार्वजनिक जिम्मेवारीमा रहेका अधिकारीहरूको बयान", "title_en": "Testimonies of Public Officials", "start_page": 28},
                            {"id": "5-1-1", "title_ne": "राजनैतिककर्मी", "title_en": "Politicians", "start_page": 28},
                            {"id": "5-1-2", "title_ne": "निजामती कर्मचारीहरूको बयान", "title_en": "Civil Servants' Testimonies", "start_page": 47},
                            {"id": "5-1-3", "title_ne": "नेपाली सेनाको बयान", "title_en": "Nepal Army Testimonies", "start_page": 74},
                            {"id": "5-1-4", "title_ne": "नेपाल प्रहरीको बयान", "title_en": "Nepal Police Testimonies", "start_page": 85},
                            {"id": "5-1-5", "title_ne": "सशस्त्र प्रहरी बलको बयान", "title_en": "Armed Police Force Testimonies", "start_page": 243},
                            {"id": "5-2", "title_ne": "प्रदर्शनका आयोजकहरूको बयान", "title_en": "Protest Organizers' Testimonies", "start_page": 278},
                            {"id": "5-3", "title_ne": "उपचारमा संलग्न चिकित्सकहरूका घटना विवरण", "title_en": "Medical Personnel's Incident Reports", "start_page": 301},
                            {"id": "5-4", "title_ne": "प्रत्यक्षदर्शीहरूका घटना विवरण", "title_en": "Eyewitness Accounts", "start_page": 306},
                            {"id": "5-5", "title_ne": "घाइतेहरूको घटना विवरण", "title_en": "Injured Persons' Accounts", "start_page": 319},
                            {"id": "5-6", "title_ne": "मृतक परिवारको तर्फबाट घटना विवरण", "title_en": "Bereaved Families' Accounts", "start_page": 335},
                        ]
                    },
                    {
                        "id": "ch-6",
                        "number": "6",
                        "title_ne": "परिच्छेद - ६: प्रदर्शनको क्रममा क्षति भएका जिल्लाका प्रमुख जिल्ला अधिकारीहरूबाट प्राप्त घटना विवरण",
                        "title_en": "Chapter 6: District Administration Incident Reports",
                        "start_page": 358,
                        "sections": [
                            {"id": "6-1", "title_ne": "कोशी प्रदेश", "title_en": "Koshi Province", "start_page": 358},
                            {"id": "6-2", "title_ne": "मधेश प्रदेश", "title_en": "Madhesh Province", "start_page": 375},
                            {"id": "6-3", "title_ne": "बागमती प्रदेश", "title_en": "Bagmati Province", "start_page": 380},
                            {"id": "6-4", "title_ne": "गण्डकी प्रदेश", "title_en": "Gandaki Province", "start_page": 392},
                            {"id": "6-5", "title_ne": "लुम्बिनी प्रदेश", "title_en": "Lumbini Province", "start_page": 397},
                            {"id": "6-6", "title_ne": "कर्णाली प्रदेश", "title_en": "Karnali Province", "start_page": 415},
                            {"id": "6-7", "title_ne": "सुदूरपश्चिम प्रदेश", "title_en": "Sudurpashchim Province", "start_page": 420},
                        ]
                    },
                    {
                        "id": "ch-7",
                        "number": "7",
                        "title_ne": "परिच्छेद - ७: स्थलगत अनुगमनको क्रममा संकलित विवरण",
                        "title_en": "Chapter 7: Field Monitoring Data",
                        "start_page": 426,
                        "sections": [
                            {"id": "7-1", "title_ne": "कोशी प्रदेश", "title_en": "Koshi Province", "start_page": 426},
                            {"id": "7-2", "title_ne": "मधेश प्रदेश", "title_en": "Madhesh Province", "start_page": 430},
                        ]
                    },
                    {
                        "id": "ch-8-11",
                        "number": "8-11",
                        "title_ne": "परिच्छेद - ८-११: अन्य प्रमाण संकलन",
                        "title_en": "Chapters 8-11: Additional Evidence Collection",
                        "start_page": 440,
                        "sections": [
                            {"id": "10-1", "title_ne": "CCTV, अडियो/भिडियो र सञ्चार माध्यम सामग्री", "title_en": "CCTV, Audio/Video and Media Content", "start_page": 544},
                            {"id": "10-2", "title_ne": "टेलिफोन सेवा प्रदायकहरूबाट प्राप्त विवरण (CDR/BTS DATA)", "title_en": "Telecom Provider Data (CDR/BTS)", "start_page": 546},
                            {"id": "11", "title_ne": "आयोगमा प्राप्त उजुरी तथा गुनासोहरु", "title_en": "Complaints and Grievances Received", "start_page": 557},
                        ]
                    },
                ]
            },
            {
                "id": "part-3",
                "title_ne": "भाग ३: विश्लेषण तथा निष्कर्ष",
                "title_en": "Part 3: Analysis and Findings",
                "start_page": 561,
                "chapters": [
                    {
                        "id": "ch-12",
                        "number": "12",
                        "title_ne": "परिच्छेद - १२: संकलित तथ्य/तथ्याङ्कहरूको विश्लेषण",
                        "title_en": "Chapter 12: Analysis of Collected Facts and Data",
                        "start_page": 561,
                        "sections": [
                            {"id": "12-1", "title_ne": "मानवीय क्षतिको विश्लेषण तथा निष्कर्ष", "title_en": "Analysis of Human Casualties", "start_page": 561},
                            {"id": "12-2", "title_ne": "भौतिक क्षतिको विश्लेषण", "title_en": "Analysis of Physical Damage", "start_page": 565},
                            {"id": "12-7", "title_ne": "Autopsy/Ballistic Report को विश्लेषण", "title_en": "Autopsy/Ballistic Report Analysis", "start_page": 614},
                            {"id": "12-13", "title_ne": "Discord को भूमिका", "title_en": "Discord Platform's Role", "start_page": 619},
                        ]
                    },
                ]
            },
            {
                "id": "part-4",
                "title_ne": "भाग ४: निष्कर्ष तथा राय सिफारिस",
                "title_en": "Part 4: Conclusions and Recommendations",
                "start_page": 635,
                "chapters": [
                    {
                        "id": "ch-13",
                        "number": "13",
                        "title_ne": "परिच्छेद - १३: जाँचबुझ आयोगको निष्कर्ष, ठहर र सिफारिस",
                        "title_en": "Chapter 13: Commission's Conclusions and Recommendations",
                        "start_page": 635,
                        "sections": [
                            {"id": "13-1", "title_ne": "२०८२ भाद्र २३ गतेको घटनाका सम्बन्धमा", "title_en": "Regarding Events of Bhadra 23, 2082", "start_page": 635},
                            {"id": "13-2", "title_ne": "भाद्र २३ र २४ गतेको घटनामा विभिन्न पदाधिकारीहरूको दायित्वको विश्लेषण", "title_en": "Analysis of Responsibilities of Officials", "start_page": 640},
                        ]
                    },
                    {
                        "id": "ch-14",
                        "number": "14",
                        "title_ne": "परिच्छेद - १४: सुधारका सुझावहरु",
                        "title_en": "Chapter 14: Reform Recommendations",
                        "start_page": 700,
                        "sections": [
                            {"id": "14-10", "title_ne": "पत्रकार र सञ्चार जगत", "title_en": "Media and Journalism", "start_page": 768},
                            {"id": "14-11", "title_ne": "गैरसरकारी संस्था व्यवस्थापन", "title_en": "NGO/INGO Management", "start_page": 777},
                            {"id": "14-13", "title_ne": "सुरक्षा संयन्त्रहरूतर्फको समस्या र सुधार", "title_en": "Security Apparatus Reform", "start_page": 786},
                            {"id": "14-14", "title_ne": "भ्रष्टाचार नियन्त्रणका सुझाव", "title_en": "Anti-Corruption Recommendations", "start_page": 837},
                            {"id": "14-15", "title_ne": "कारागारका समस्या र सुधार", "title_en": "Prison Reform", "start_page": 849},
                            {"id": "14-16", "title_ne": "सुशासन कायम गर्नका लागि सुझाव", "title_en": "Good Governance Recommendations", "start_page": 864},
                            {"id": "14-17", "title_ne": "सत्य निरूपण तथा मेलमिलाप", "title_en": "Truth and Reconciliation", "start_page": 889},
                        ]
                    },
                ]
            },
            {
                "id": "part-5",
                "title_ne": "भाग ५: सुझाव कार्यान्वयन योजना र उपसंहार",
                "title_en": "Part 5: Implementation Plan and Conclusion",
                "start_page": 892,
                "chapters": [
                    {
                        "id": "ch-conclusion",
                        "number": "15",
                        "title_ne": "सुझाव कार्यान्वयनको कार्ययोजना र उपसंहार",
                        "title_en": "Implementation Action Plan and Conclusion",
                        "start_page": 892,
                        "sections": [
                            {"id": "impl-plan", "title_ne": "कार्यान्वयन योजना", "title_en": "Implementation Plan", "start_page": 892},
                            {"id": "conclusion", "title_ne": "उपसंहार", "title_en": "Conclusion", "start_page": 896},
                        ]
                    },
                ]
            },
        ],
        "key_stats": {
            "total_deaths": 76,
            "deaths_by_security_forces": 42,
            "police_killed": 3,
            "deaths_looting": 31,
            "total_injured": 2522,
            "property_damage_crore": 85,
            "provinces_affected": 7,
            "total_pages": 907,
            "event_date_ne": "२०८२ भाद्र २३-२४",
            "event_date_en": "Bhadra 23-24, 2082 BS",
            "commission_formed": "2082/06/05",
            "report_submitted": "2082 Bhadra",
        }
    }
    return structure


def main():
    print(f"Opening PDF: {PDF_PATH}")
    doc = fitz.open(str(PDF_PATH))
    print(f"Total pages: {len(doc)}")

    print("Extracting page text...")
    pages = extract_pages(doc)
    doc.close()

    out_ne = DATA_DIR / "pages_ne.json"
    with open(out_ne, "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(pages)} pages to {out_ne}")

    print("Building chapter structure...")
    structure = parse_structure(pages)
    out_struct = DATA_DIR / "structure.json"
    with open(out_struct, "w", encoding="utf-8") as f:
        json.dump(structure, f, ensure_ascii=False, indent=2)
    print(f"Saved structure to {out_struct}")

    print("Done! Now run translate.py to generate English translation.")


if __name__ == "__main__":
    main()
