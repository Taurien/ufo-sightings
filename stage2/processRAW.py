# Database credentials
hostname = "localhost:3306"
username = "root"
password = "Qwerty8975_"
database = "nuforc"

import json
import sys
from sqlalchemy import create_engine, MetaData, Table, Column, String, or_, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import requests
from bs4 import BeautifulSoup, NavigableString, Tag
import re
from types import SimpleNamespace


def get_label_value_pairs(ca):
    fields = {}
    last_terminator = None
    for b in ca.find_all("b"):
        label = b.get_text(" ", strip=True).rstrip(":").strip().lower()  # 🔽 lower key
        value_parts = []
        node = b.next_sibling
        while node is not None:
            if isinstance(node, Tag) and node.name in ["b", "i"]:
                break
            if isinstance(node, Tag) and node.name == "br":
                last_terminator = node
                break
            if isinstance(node, NavigableString):
                text = str(node).strip()
                if text:
                    value_parts.append(text)
            elif isinstance(node, Tag):
                txt = node.get_text(" ", strip=True)
                if txt:
                    value_parts.append(txt)
            node = node.next_sibling
        val = " ".join(value_parts).strip()
        fields[label] = val if val != "" else None
    return fields, last_terminator


try:
    engine = create_engine(
        f"mysql+mysqlconnector://{username}:{password}@{hostname}/{database}"
    )
    Session = sessionmaker(bind=engine)

    with Session() as session:
        print("Connection to the MySQL database was successful")

        metadata = MetaData()
        ufos_table = Table(
            "UFOS",
            metadata,
            Column("id", String, primary_key=True),
            Column("details", String),
            Column("description", String),
            Column("RAW", String),
        )

        # Select records where 'RAW' has values diff than "" and 'details' or 'description' are empty or null
        query = select(ufos_table).where(
            ufos_table.c.RAW != "",
            or_(ufos_table.c.details == "", ufos_table.c.details.is_(None)),
            or_(ufos_table.c.description == "", ufos_table.c.description.is_(None)),
        )
        result_proxy = session.execute(query)
        ufos_to_process = result_proxy.fetchall()
        print(len(ufos_to_process), "records found with 'RAW' values.")

        for ufo in ufos_to_process:
            soup = BeautifulSoup(ufo.RAW, "html.parser")
            ca = soup.find("div", class_="content-area")

            rpt = {}
            # title
            h1 = ca.find("h1")
            rpt["title"] = h1.get_text(strip=True) if h1 else None

            # posted
            posted_tag = None
            for i_tag in ca.find_all("i"):
                if i_tag.get_text(strip=True).lower().startswith("posted"):
                    posted_tag = i_tag
                    break

            fields, last_terminator = get_label_value_pairs(ca)
            for k, v in fields.items():
                rpt[k] = v

            # description
            desc_parts = []
            start_node = last_terminator.next_sibling if last_terminator else None
            if not start_node:
                last_b = ca.find_all("b")[-1] if ca.find_all("b") else None
                start_node = last_b.next_sibling if last_b else None

            node = start_node
            while node is not None and node is not posted_tag:
                if isinstance(node, Tag) and node.name == "br":
                    node = node.next_sibling
                    continue
                if isinstance(node, NavigableString):
                    text = str(node).strip()
                    if text:
                        desc_parts.append(text)
                elif isinstance(node, Tag):
                    txt = node.get_text(" ", strip=True)
                    if txt:
                        desc_parts.append(txt)
                node = node.next_sibling

            desc = " ".join(desc_parts).strip()
            for v in fields.values():
                if v:
                    desc = desc.replace(v, "")
            desc = re.sub(r"\s+", " ", desc).strip()
            rpt["description"] = desc or None

            if posted_tag:
                posted_text = posted_tag.get_text(" ", strip=True)
                if posted_text.lower().startswith("posted"):
                    posted_text = (
                        posted_text.split(" ", 1)[1] if " " in posted_text else None
                    )
                rpt["posted"] = posted_text
            else:
                rpt["posted"] = None

            # 🔽 force all keys to lowercase
            rpt = {k.lower(): v for k, v in rpt.items()}

            # {
            #     "title": "NUFORC UFO Sighting 192462",
            #     "occurred": "2025-09-13 23:35 Local",
            #     "reported": "2025-09-13 22:30 Pacific",

            #     "duration": "on going right now",
            #     "no of observers": "2",
            #     "location": "Alma, TX, USA",
            #     "location details": "11802 N. W. County Road 170, Ennis, TX 75119",
            #     "shape": "Light",
            #     "color": "Green and Red Lights",
            #     "estimated size": "aurplane size",
            #     "viewed from": "Land",
            #     "direction from viewer": "northwest, southwest,",
            #     "angle of elevation": "90",
            #     "closest distance": "20,000 feet, 30,000 feet",
            #     "estimated speed": "fast jerky motions",
            #     "characteristics": "Lights on object, Aura or haze around object, Changed Colo",

            #     "description": 'Crafts in sky looks like they are sky-writing in cursive in tight very jerky motions & up & down & back & forth I live out in country. Been seeing UFOs for 5-years, never anything like this. My brother in law is leaving 11:30 pm 9/13/05, from visit today. Told him were gonna walk outside & casually scan the skies for the lights/ufos I have been seeing. Dont let them know you see them because they seem to know and will take off. Didnt see what I usually see. Were standing there talking and said, "theres plane." Then the "plane" turned & starting coming back towards high in the sky. Then the craft started jerking every which way. It looked like it was sky-writing in cursive in tight jerky motions, then it would go up and down, back and forth, within a tight small area, then it might fly a second then start again with jerking around every which. By this my brother in law and I are dumbfounded. What is it doing? How is it doing this? Is this something of Elon Musks? This is not a drone, not a satellite, dont think it starlink of any kind. Its moving in crazy ways. I go get phone to attempt to videotape. My camera cant see lights that far up in the sky. We are watching & watching & confused. He is about to leave and I see another one in sky to my right and at same he is seeing another one off to his left & we still see the original one. The additional ones we see are doing same weird motions. Then I saw another one, he sees another one. I saw at least 6. I had to quit looking because this is scaring me bad. I said I have to go in, I cant handle. I am scared. I am going to be here alone and these things are in sky above me. I am sure they are out there right now still doing whatever they are doing. Brother in law left, takes him 45 minutes to get home. Someone needs to explain this to me and dont tell me they dont know what Im talking about because they damn sure do know! I have been trying this since I came inside this mobile home. I hope this goes through.',
            #     "posted": "2025-09-24",
            # } rpt

            # DB columns:
            # id
            # title
            # occurred
            # reported
            # details
            # description
            # posted
            # RAW

            # Create a new dictionary without the specified keys
            keys_to_remove = ["title", "occurred", "reported", "description", "posted"]
            dtls = {
                key: value for key, value in rpt.items() if key not in keys_to_remove
            }

            try:
                update_query = (
                    ufos_table.update()
                    .where(ufos_table.c.id == ufo.id)
                    .values(
                        details=json.dumps(dtls, indent=4),
                        description=rpt.get("description"),
                    )
                )

                session.execute(update_query)
                session.commit()
                print(f"Successfully updated record {ufo.id}")

            except SQLAlchemyError as e:
                print(f"Database error for ID {ufo.id}: {e}")
                sys.exit(1)


except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
