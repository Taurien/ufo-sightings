# Database credentials
hostname = "localhost:3306"
username = "root"
password = "Qwerty8975_"
database = "nuforc"


import random
import sys
import time
from sqlalchemy import create_engine, MetaData, Table, Column, String, or_, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import requests
from bs4 import BeautifulSoup

proxies = {
    "http": "http://127.0.0.1:8888",
    "https": "http://127.0.0.1:8888",
}

user_agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/96.0.4664.53 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14.4; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux i686; rv:124.0) Gecko/20100101 Firefox/124.0",
    "Mozilla/5.0 (Linux; Android 13; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPad; CPU OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36",
]

try:
    engine = create_engine(
        f"mysql+mysqlconnector://{username}:{password}@{hostname}/{database}"
    )
    Session = sessionmaker(bind=engine)

    with Session() as session:
        print("🎉 Connection to the MySQL database was successful!")

        metadata = MetaData()
        ufos_table = Table(
            "UFOS",
            metadata,
            Column("id", String, primary_key=True),
            Column("RAW", String),
        )

        # Select records with empty or null 'RAW' values
        query = select(ufos_table.c.id).where(
            or_(ufos_table.c.RAW == "", ufos_table.c.RAW.is_(None))
        )
        result_proxy = session.execute(query)
        ids_to_process = [row[0] for row in result_proxy.fetchall()]

        if ids_to_process:
            print(f"Found {len(ids_to_process)} records to procsess.")

            for ufo_id in ids_to_process:
                try:
                    print(f"Fetching data for ID: {ufo_id}")

                    current_user_agent = random.choice(user_agents)
                    headers = {"User-Agent": current_user_agent}

                    # response = requests.get(f'https://nuforc.org/sighting/?id={ufo_id}', proxies=proxies,headers=headers, timeout=10)
                    response = requests.get(
                        f"https://nuforc.org/sighting/?id={ufo_id}",
                        proxies=proxies,
                        headers=headers,
                        timeout=10,
                    )
                    response.raise_for_status()

                    soup = BeautifulSoup(response.text, "html.parser")
                    content_area = soup.find("div", class_="content-area")

                    if content_area:
                        update_query = (
                            ufos_table.update()
                            .where(ufos_table.c.id == ufo_id)
                            .values(RAW=str(content_area))
                        )
                        session.execute(update_query)
                        print(f"Successfully updated record {ufo_id}")
                    else:
                        print(f"Could not find '.content-area' for ID {ufo_id}")
                        update_query = (
                            ufos_table.update()
                            .where(ufos_table.c.id == ufo_id)
                            .values(RAW="Could not find '.content-area'")
                        )
                        session.execute(update_query)

                    session.commit()

                    time_to_wait = random.uniform(2, 5)
                    print(
                        f"Waiting for {time_to_wait:.2f} seconds before the next request..."
                    )
                    time.sleep(time_to_wait)

                except requests.exceptions.HTTPError as e:
                    print(f"HTTP Error for ID {ufo_id}: {e}")
                    sys.exit(1)

                except requests.exceptions.RequestException as e:
                    print(f"Request error for ID {ufo_id}: {e}")
                    update_query = (
                        ufos_table.update()
                        .where(ufos_table.c.id == ufo_id)
                        .values(RAW="Failed to fetch data")
                    )
                    session.execute(update_query)
                    session.commit()
                    sys.exit(1)

                except SQLAlchemyError as e:
                    print(f"Database error for ID {ufo_id}: {e}")
                    update_query = (
                        ufos_table.update()
                        .where(ufos_table.c.id == ufo_id)
                        .values(RAW="Database update failed")
                    )
                    session.execute(update_query)
                    session.commit()
                    sys.exit(1)

        else:
            print("No records found with empty or null 'RAW' values.")

except SQLAlchemyError as e:
    print(f"❌ Error connecting to the database: {e}")
