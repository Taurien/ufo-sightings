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
    You are a data cleaning specialist fixing malformed UFO sighting location records.

    INPUT LOCATION:
    "{location_text}"

    COMMON DATASET ISSUES (fix these):
    1. Truncated text mid-word (e.g., "Lor" → "Lorraine", "eastpoint0" → "Eastpointe")
    2. Numeric typos: "0" instead of ")" or "O", "1" instead of "I" or "l"
    3. Unbalanced brackets/parentheses (missing opening/closing)
    4. Cut-off descriptive phrases: "(suburb of", "(near", "(between", "(approx", "(County"
    5. Incomplete state/country codes (e.g., "UK/England)" → "(UK/England)")
    6. Missing geographic qualifiers after prepositions: "of,", "near)", "from"
    7. Malformed coordinates (preserve but fix format)
    8. Double punctuation or spacing errors: "  ", ",,", "))"
    9. Incomplete highway/route numbers: "I-", "Hwy.", "Rte."
    10. Cut-off international location names

    LOCATION FORMAT PATTERNS IN DATASET:
    - "City (descriptor), State/Country"
    - "City (detail) (more detail), State/Country"
    - "City (Lat XX°XX'N Lon XX°XX'W), State/Country"
    - "Highway/Route (direction/marker), State/Country"
    - "City (County Name), State/Country"
    - "City (suburb of Larger City), State/Country"

    VALIDATION CHECKLIST:
    ✓ All opening parentheses "(" have matching closing ")"
    ✓ All opening brackets "[" have matching closing "]"
    ✓ No trailing incomplete words or phrases
    ✓ No obvious typos (0 for ), 1 for l/I)
    ✓ State/country codes are complete (USA, United Kingdom, Canada, etc.)
    ✓ Descriptive phrases are complete (not ending mid-phrase)
    ✓ No double spaces or duplicate punctuation
    ✓ Geographic coordinates are properly formatted if present
    ✓ Prepositions (of, near, from, between) are followed by complete location names

    CORRECTION RULES:
    1. Fix ONLY what is clearly malformed or incomplete
    2. Preserve ALL original details and specificity
    3. Use geographic/linguistic knowledge to complete truncations
    4. Maintain exact original formatting style (parentheses, commas, capitalization where clear)
    5. If multiple corrections possible, choose most geographically plausible
    6. For ambiguous cases, prioritize structural fixes (parentheses) over content guesses
    7. Keep directional indicators: N, S, E, W, NE, SW, etc.
    8. Preserve distance measurements: miles, mi., km
    9. Keep highway/route numbers: I-95, Hwy 50, Route 66
    10. Maintain landmarks: airports, rivers, bridges, amphitheaters

    SPECIAL CASES:
    - UK locations: Format as "(UK/England)", "(UK/Scotland)", "(Northern Ireland)"
    - Canadian provinces: Use 2-letter codes (ON, BC, AB, SK, MB, NT, QC)
    - US states: Use 2-letter codes (CA, TX, NY, FL, etc.)
    - International: Keep country name as final element
    - Coordinates: Keep format "Lat XX°XX'N Lon XX°XX'W" or similar
    - "In orbit (space)" → special non-terrestrial location, keep as-is if complete

    OUTPUT REQUIREMENTS:
    - Return ONLY the corrected location text
    - NO explanations, commentary, or metadata
    - NO quotes around the output
    - NO newlines or extra whitespace
    - If input is already correct, return it unchanged
    - Must be valid, complete, grammatically correct location string

    CORRECTED LOCATION:
    """

    response = request(prompt)
    return response.strip().strip('"').strip("'").strip()


def extract_coordinates(location_text):
    prompt = f"""
    Extract latitude and longitude coordinates from the text below and return them as decimal degrees.

    TEXT:
    {location_text}

    INSTRUCTIONS:
    1. Find the first valid coordinate pair (latitude and longitude)
    2. Handle ALL these coordinate formats:
    
    DECIMAL FORMATS:
    - Standard: 40.5531, -105.0915 or 40.436-104.957
    - With slash: 39.594090/-104.948020
    - With separators: 41.79775 x -75.03377 or 41.045274 - 85.248442
    - With symbols: 33.7094•n, 78.775• or 45.64880º N
    - Parentheses: (40.8880945, -74.7244653)
    - Negative first: -31.723614 -60.332883
    - European comma: 27,89480° N, 36,10730° W (comma becomes period)
    - Plain space: 38.3963817 78.9561585
    - LaTeX escaped: \(40.584167\)° N
    
    DMS (Degrees Minutes Seconds):
    - Standard: 40°33'11"N 74°05'55"W
    - With spaces: 40 45 49.9 N 74 59 18 W or 53 43 15 N, 0 25 59 W
    - Space-separated with comma decimal: 46  06  16,97N (multiple spaces, comma in seconds)
    - Unusual spacing: N33 87 3940 = N33°87'39.40" (interpret as degrees minutes seconds)
    - Mixed quotes: 40°41′29″ N 73°57′32″ W
    - Shortened: 34.5.5" N = 34°5'5"N or 46.47.51"N = 46°47'51"N
    - With periods: 43°36' 53.828'
    - Incomplete: 35° 13' 18.5232'' N 75° 31 (missing seconds on second coord)
    
    DECIMAL MINUTES:
    - With apostrophe: 7°48.760'N 98°17.635'E or 27°16.050'N 80°1.704'W
    - With colon: 40:02.632 or 43:21.137n
    - With asterisk: 45* 46.967'N, 95* 21.632'W
    - Named: N40°02.632 W73°58.499 or 40(o)46.8N 73(o) 1.6W
    
    LABELED FORMATS:
    - Colon labels: LAT: 41.4439, LONG: -90.64362
    - Word labels: Latitude: 35.4426 Longitude: -80.8657
    - Semicolon DMS: LAT: 38; 56; 41.85 - LONG: 7; 46; 3.99
    - No space: Latitude: 33.9935° NLongitude: 118.4562° W
    - German: Breitengrad 53°52'27.67"N, Längengrad 8°38'3.16"E
    
    URLs & SPECIAL:
    - Extract from URLs: ll=53.851772,-1.859170 or lat=32.803&lng=-117.135
    - Ranges: "X to Y" - extract first coordinate only
    - Multiple locations: Take first valid pair (ignore labels like "my location:", "UAP:", etc.)
    - Plus codes: IGNORE (8F7J+F6V, 8H5C+3VQ) - only extract lat/lon if present
    - UTM/MGRS: IGNORE unless lat/lon also present

    3. Convert to decimal degrees:
    - DMS: 40°33'11" = 40 + 33/60 + 11/3600
    - Unusual spacing (N33 87 3940): Interpret as 33°87'39.40" = 33 + 87/60 + 39.40/3600
    - Space-separated comma: 46  06  16,97 = 46°06'16.97" (convert comma to period)
    - Decimal minutes: 7°48.760' = 7 + 48.760/60
    - Shortened DMS: 34.5.5 = 34°5'5" = 34 + 5/60 + 5/3600
    - Semicolon: 38; 56; 41.85 = 38°56'41.85"
    - European comma: Replace comma with period
    - Incomplete: If seconds missing, assume 0

    4. Handle errors and ambiguity:
    - Missing decimal points: If coordinate looks wrong (e.g., -1149693 for longitude), try inserting decimal (e.g., -114.9693)
    - No hemisphere indicators: Assume reasonable Earth coordinates (lat: -90 to 90, lon: -180 to 180)
    - Multiple coordinate pairs: Always extract first valid pair
    
    5. Apply correct signs:
    - Latitude: N/Norte/North/positive = +, S/Sul/South/negative = -
    - Longitude: E/Este/East/positive = +, W/O/V/Oeste/West/negative = -
    - Already negative values remain negative
    - Bearings/headings (340°, 263deg) are NOT coordinates

    6. Ignore completely:
    - Descriptive text, directions, bearings, elevations, temperatures
    - Wind, distances, viewing angles, azimuth/altitude, magnetic declination
    - Street addresses, building descriptions, time, weather
    - UTM/MGRS, Plus codes, quality indicators
    - Ranges/paths (extract first only)

    7. Output format:
    - Use period (.) as decimal separator
    - Return ONLY: {{lat=XX.XXXXX, lon=YY.YYYYY}}
    - If no valid coordinates found: None

    EXAMPLES:
    Input: "46  06  16,97N 19  37  40,93E  to  45  58  20,88N 19  06  31.46E"
    Output: {{lat=46.10471, lon=19.62804}}

    Input: "N33 87 3940 W 112 045 3050"
    Output: {{lat=35.46056, lon=-113.01417}}

    Input: "36.1426, -115.0884 approximate location of the object 36.0604, -1149693"
    Output: {{lat=36.1426, lon=-115.0884}}

    Input: "https://maps.apple.com/?ll=53.851772,-1.859170&q=StIvesEstate"
    Output: {{lat=53.851772, lon=-1.859170}}

    Input: "(41.3137258, -89.5194417) 8F7J+F6V Tiskilwa, Illinois"
    Output: {{lat=41.3137258, lon=-89.5194417}}

    Input: "Jaguaquara BA 3° travessa rua Manoel Victor bairro Santa Luzia"
    Output: None

    Input: "38.3963817 78.9561585"
    Output: {{lat=38.3963817, lon=78.9561585}}

    Input: "LAT: 38; 56; 41.85 - LONG: 7; 46; 3.99"
    Output: {{lat=38.94496, lon=7.76777}}

    Input: "Looking westward 40°- 60° degrees upward"
    Output: None

    Now extract coordinates from the TEXT above:
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
