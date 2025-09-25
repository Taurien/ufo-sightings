# Database credentials
hostname = "localhost:3306"
username = "root"
password = "Qwerty8975_"
database = "nuforc"

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
            Column("RAW", String),
        )

        # Select records with id 966 and 3511 and 'RAW' values
        # id 966 && 3511
        query = select(ufos_table.c.id, ufos_table.c.RAW).where(
            or_(ufos_table.c.id == "966", ufos_table.c.id == "3511"),
            or_(ufos_table.c.RAW != ""),
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

            print("------------------------------------", ufo)
            print("xxxxxxxxxxxxxxxxxxxx")
            print("------------------------------------", rpt)

        # else:
        #     print("No records found with 'RAW' values.")

except SQLAlchemyError as e:
    print(f"❌ Error connecting to the database: {e}")
