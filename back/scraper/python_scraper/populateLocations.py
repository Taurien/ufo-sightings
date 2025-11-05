import os
from dotenv import load_dotenv
import csv
import re
from fetchUfo import fetchUfo
import random
import sys
import time
from sqlalchemy import (
    and_,
    func,
    not_,
    update,
    JSON,
    DateTime,
    Text,
    create_engine,
    insert,
    or_,
    select,
    Table,
    MetaData,
    Column,
    String,
    Integer,
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import json
from geopy.geocoders import Nominatim
import time

load_dotenv()

hostname = os.getenv("DB_HOST")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")

geolocator = Nominatim(user_agent="nuforc_scraper_app", timeout=10)


def export_location_csv(name, ufo_id, location):
    csv_file = name
    write_header = not os.path.exists(csv_file)
    with open(csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        if write_header:
            writer.writerow(["ufo_id", "location"])
        writer.writerow([ufo_id, location])


def parens_not_closed(s):
    return s.count("(") != s.count(")")


def has_comma_in_parens(s):
    return bool(re.search(r"\([^)]*,[^)]*\)", s))


def contains_coordinates(location):
    """
    Check if a location string contains coordinates in various formats.

    Args:
        location (str): The location string to check

    Returns:
        bool: True if coordinates are detected, False otherwise
    """
    if not isinstance(location, str):
        return False

    location = location.strip()

    # If it's too short, unlikely to be coordinates
    if len(location) < 5:
        return False

    # Strong indicators of coordinates
    strong_patterns = [
        # Explicit lat/long keywords
        r"\b(lat|latitude|long|longitude|GPS|coordinates?)\s*[:=]?\s*-?\d+\.?\d*",
        # Decimal coordinates in parentheses (40.7128, -74.0060)
        r"\(\s*-?\d+\.\d+\s*,\s*-?\d+\.\d+\s*\)",
        # DMS format with symbols
        r"\d+\s*[°]\s*\d+\s*[\'′]\s*[\d.]+\s*[\"″]?\s*[NSEW]",
        # Degree format with N/S/E/W
        r"\d+\.\d+\s*[°]?\s*[NSEW]\s*[,&]\s*\d+\.\d+\s*[°]?\s*[NSEW]",
        # Simple degree format (40 06 16,97N)
        r"\d+\s+\d+\s+\d+[,.]?\d*\s*[NSEW]",
        # MGRS format
        r"\b\d{1,2}[A-Z]\s+[A-Z]{2}\s+\d+\s+\d+\b",
        # UTM format
        r"\bUTM\s*:?\s*\d+",
        # Decimal degrees with comma (two numbers)
        r"-?\d+\.\d{3,}\s*,\s*-?\d+\.\d{3,}",
        # Space-separated decimal coordinates
        r"\b\d+\.\d{5,}\s+-?\d+\.\d{5,}\b",
    ]

    for pattern in strong_patterns:
        if re.search(pattern, location, re.IGNORECASE):
            return True

    # Check for degree symbol usage (stronger indicator)
    if "°" in location or "Â°" in location:
        # Has degree symbol and numbers
        if re.search(r"\d+\.?\d*\s*[°Â°]", location):
            return True

    # Check for coordinates-like patterns (but exclude street addresses)
    # Must have at least one decimal point and not be a street address
    if re.search(r"\d+\.\d+", location):
        # Exclude if it looks like a street address
        street_indicators = [
            r"\b\d+\s+(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|way|place|pkwy|parkway|ct|court|circle|ter|terrace)\b",
            r"\b(apartment|apt|unit|suite|floor|#)\b",
        ]

        is_street_address = any(
            re.search(pattern, location, re.IGNORECASE) for pattern in street_indicators
        )

        if not is_street_address:
            # Check for two decimal numbers (likely coordinates)
            decimal_numbers = re.findall(r"-?\d+\.\d+", location)
            if len(decimal_numbers) >= 2:
                # Check if numbers are in coordinate range
                for num in decimal_numbers[:2]:
                    try:
                        val = abs(float(num))
                        # Latitude range: 0-90, Longitude range: 0-180
                        if 0 <= val <= 180:
                            return True
                    except:
                        pass

    return False


def get_coordinates(ufo_id, location):
    print(f"Fetching coordinates for UFO ID {ufo_id} at location: {location}")

    result = None
    coordinates = None

    result = geolocator.geocode(f"{location}")

    if result:
        coordinates = {"latitude": result.latitude, "longitude": result.longitude}
        return coordinates
    else:
        export_location_csv("not_found_locations.csv", ufo_id, location)
        return None


def handle_location(ufo_id, location):
    splitted_location = location.split(",")
    country = splitted_location[-1].strip()

    coordinates = {"country": country}
    coords = None

    if "(" in location or ")" in location:
        if parens_not_closed(location):
            # location = fill_cutted_location(location)
            # return handle_location(ufo_id, location)
            # export_location_csv(
            #     "parens_not_closed.csv",
            #     ufo_id,
            #     location,
            # )
            test = 2
        else:
            # export_location_csv(
            #     "parens_present.csv",
            #     ufo_id,
            #     location,
            # )
            test = 2
    else:
        if len(splitted_location) == 1 and (
            splitted_location[0].strip() == ""
            or splitted_location[0].strip() == "Unspecified"
        ):
            # export_location_csv(
            #     "empty.csv",
            #     ufo_id,
            #     location,
            # )
            test = 2
        else:
            if len(splitted_location) > 3:
                # export_location_csv(
                #     "filled_3_more.csv",
                #     ufo_id,
                #     splitted_location,
                # )
                test = 2
            elif len(splitted_location) == 3:
                coords = get_coordinates(ufo_id, location)
                # export_location_csv(
                #     "filled_3.csv",
                #     ufo_id,
                #     splitted_location,
                # )

            elif len(splitted_location) == 2:
                coords = get_coordinates(ufo_id, location)
                # export_location_csv(
                #     "filled_2.csv",
                #     ufo_id,
                #     splitted_location,
                # )

            else:
                # coords = get_coordinates(ufo_id, location)
                # export_location_csv(
                #     "filled_1.csv",
                #     ufo_id,
                #     splitted_location,
                # )
                test = 2

    if coords is None:
        return None
    else:
        coordinates["coords"] = coords
        return coordinates


try:
    engine = create_engine(
        f"mysql+mysqlconnector://{username}:{password}@{hostname}/{database}"
    )
    Session = sessionmaker(bind=engine)

    with Session() as session:

        metadata = MetaData()
        ufos_table = Table(
            "UFOS",
            metadata,
            Column("id", Integer, primary_key=True, autoincrement=True),
            Column("details", JSON, nullable=True),
            Column("location", JSON, nullable=True),
            Column("coordinates", JSON, nullable=True),
        )

        # query = select(ufos_table).where(
        #     or_(ufos_table.c.location == None, ufos_table.c.location == ""),
        # )
        query = select(ufos_table).where(
            and_(
                or_(ufos_table.c.location == None, ufos_table.c.location == ""),
                ufos_table.c.id >= 104472,
            )
        )
        results = session.execute(query).fetchall()
        print(f"Found {len(results)} records with missing location.")

        for row in results:
            ufo_id = row[0]
            details = row[1]
            location = details.get("location", "")
            location_details = details.get("location_details", "")

            coordinates_data = None

            if location_details:
                # if contains_coordinates(location_details):
                #     # coords1 = handle_location(ufo_id, location)
                #     # coords2 = extract_coordinates(location_details)
                #     # export_location_csv(
                #     #     "location_details_w_coors.csv",
                #     #     ufo_id,
                #     #     location_details,
                #     # )
                #     # coordinates = choose_between_coords(coords1, coords2)
                #     test = 2
                # else:
                #     coordinates = handle_location(ufo_id, location)
                test = 2
            else:
                coordinates_data = handle_location(ufo_id, location)

            loc = {}
            if location and location != "":
                loc["area"] = location
            # if location_details and location_details != "":
            #     loc["details"] = location_details

            if coordinates_data is None:
                # print("====================")
                # print(f"UFO ID: {ufo_id}")
                # print(f"Location: {loc}")
                # print("====================")
                test = 2

            else:

                loc["country"] = coordinates_data.get("country")

                export_location_csv(
                    f"filled.csv",
                    ufo_id,
                    f"|| {loc} || {coordinates_data.get('coords')} ",
                )
                update_stmt = (
                    update(ufos_table)
                    .where(ufos_table.c.id == ufo_id)
                    .values(
                        location=loc,
                        coordinates=coordinates_data.get("coords"),
                    )
                )
                session.execute(update_stmt)
                session.commit()


except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)
