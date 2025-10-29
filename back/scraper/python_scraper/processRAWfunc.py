import os
import csv
from bs4 import BeautifulSoup, NavigableString, Tag
import re
from types import SimpleNamespace


def has_line_break(location):
    if any(c in location for c in ["\n", "\r"]):
        return True
    else:
        return False


def clean_location(loc):
    """
    Clean location strings by removing:
    1. Empty segments (", ,", ",,")
    2. Dash-only segments ("-", "--")
    3. Duplicate consecutive segments ("AZ, AZ")

    Args:
        loc: Location string to clean

    Returns:
        Cleaned location string
    """
    if not loc:
        return loc

    # Split by comma and strip whitespace from each segment
    segments = [seg.strip() for seg in loc.split(",")]

    # Remove empty segments and dash-only segments
    segments = [seg for seg in segments if seg and seg.strip("-")]

    # Remove consecutive duplicates (case-insensitive comparison)
    cleaned_segments = []
    for i, seg in enumerate(segments):
        # Add segment if it's the first one or different from the previous
        if i == 0 or seg.lower() != segments[i - 1].lower():
            cleaned_segments.append(seg)

    # Join back with comma and space
    cleaned = ", ".join(cleaned_segments)

    return cleaned


def parse_ufo_html(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    # ca = soup.find("div", class_="content-area")
    result = {}

    # Title
    h1 = soup.find("h1")
    if h1:
        result["title"] = h1.get_text(strip=True)

    # Dynamically extract all <b>Label:</b> fields, normalize keys
    b_tags = soup.find_all("b")
    last_b_tag = None

    for b in b_tags:
        label = b.get_text(strip=True).rstrip(":")
        key = label.strip().lower().replace(" ", "_")
        value = ""
        next_sibling = b.next_sibling
        while next_sibling:
            if getattr(next_sibling, "name", None) == "br":
                break
            if isinstance(next_sibling, str):
                value += next_sibling.strip()
            next_sibling = next_sibling.next_sibling
        result[key] = value
        last_b_tag = b  # Keep track of the last <b> tag

    # Description: Find all <br/><br/> (double line breaks) after the last <b> tag
    # and collect text until <i>Posted...</i>
    description = []

    if last_b_tag:
        # Start from the last <b> tag and find the next double <br/>
        node = last_b_tag

        # Skip forward past the value and find double <br/>
        while node:
            if getattr(node, "name", None) == "br":
                # Check if next sibling is also a <br/>
                next_node = node.next_sibling
                if getattr(next_node, "name", None) == "br":
                    # Found double <br/>, start collecting from here
                    node = next_node.next_sibling
                    break
            node = node.next_sibling

        # Now collect the description text
        while node:
            if getattr(node, "name", None) == "i" and "Posted" in str(
                getattr(node, "string", "")
            ):
                break
            if isinstance(node, str):
                text = node.strip()
                if text:
                    description.append(text)
            elif getattr(node, "name", None) == "br":
                description.append("\n")
            node = node.next_sibling

        if description:
            desc = "".join(description).strip()
            desc = re.sub(r"\n{3,}", "\n\n", desc)
            result["description"] = desc

    # Posted date (always at the end)
    posted_i = soup.find("i", string=re.compile(r"Posted"))
    if posted_i:
        posted_text = posted_i.get_text(strip=True)
        posted_date = posted_text.replace("Posted", "").strip()
        result["posted"] = posted_date

    return result


def process_raw(RAW):

    rpt = parse_ufo_html(RAW)

    keys_to_remove = [
        "title",
        "occurred",
        "reported",
        "description",
        "posted",
    ]
    dtls = {key: value for key, value in rpt.items() if key not in keys_to_remove}

    location = dtls.get("location", "")

    if location == ", ,":
        location = ""
    else:
        if has_line_break(location):
            location = clean_location(location.replace("\n", " ").replace("\r", " "))
        else:
            location = clean_location(location)

    dtls["location"] = location

    return SimpleNamespace(
        title=rpt.get("title"),
        occurred=rpt.get("occurred"),
        reported=rpt.get("reported"),
        details=dtls,
        description=rpt.get("description"),
        posted=rpt.get("posted"),
    )
