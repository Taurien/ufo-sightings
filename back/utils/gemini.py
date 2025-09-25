from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Missing GEMINI_API_KEY in .env file")

client = genai.Client(api_key=api_key)


def request(prompt):
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return response.text


def fill_cutted_location(location_text):
    prompt = f"""
    The following location text appears to be cut off or incomplete:
    {location_text}

    Please provide a more complete version of this location, filling in any missing parts or details.

    If the text is already complete, return it as is.

    Return only the completed location text without any extra commentary.
    """

    response = request(prompt)
    return response


def extract_coordinates(location_text):
    prompt = f"""
    Extract only the latitude and longitude coordinates from the following text:
    {location_text}

    Return them in this exact format:
    {{lat=44.50155, lon=11.33989}}

    Rules:
    -If multiple coordinates are found, extract the first valid pair.

    -Accept any common coordinate format, including:
        *Decimal degrees (e.g., 40.5531, -74.0987)
        *Degrees, minutes, seconds (e.g., 40°33'11"N 74°05'55"W)
        *Formats like Latitude: 35.4426 Longitude: -80.8657 or mixed text
    -Always convert to decimal degrees if necessary.
    -Use a period . for decimal separator.
    -Omit any extra text — just output the coordinates in the given format.
    -If no coordinates are found, return None.
    """

    response = request(prompt)
    return response


def choose_between_coords(coords1, coords2):
    prompt = f"""
    Given two sets of coordinates extracted from location data, choose the most accurate and reliable set.

    Coordinates 1: {coords1}
    Coordinates 2: {coords2}

    Rules for selection:
    -Prefer coordinates that are in decimal degree format.
    -If one set has more decimal places, prefer that set.
    -If one set appears more complete or precise, prefer that set.
    -If both sets are equally valid, choose the first set.

    Return only the chosen coordinates in this exact format:
    {{lat=XX.XXXXX, lon=YY.YYYYY}}
    """

    response = request(prompt)
    return response
