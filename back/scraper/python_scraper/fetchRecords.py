

import os
from dotenv import load_dotenv
from fetchUfo import fetchUfo, last_record_id
import random
import sys
import time
from sqlalchemy import (
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
from sqlalchemy.dialects.mysql import LONGTEXT

load_dotenv()

hostname = os.getenv("DB_HOST")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")


def check_missed_records(ufos_table, session):
    query = select(ufos_table.c.id).where(
        or_(
            ufos_table.c.RAW.startswith("Could not find"),
            ufos_table.c.RAW.startswith("Timeout error after"),
            ufos_table.c.RAW.startswith("HTTP Error occurred"),
            ufos_table.c.RAW.startswith("Network error after"),
            ufos_table.c.RAW.startswith("Request Exception occurred"),
            ufos_table.c.RAW.startswith("Failed to fetch data"),
            ufos_table.c.RAW.startswith("Database Exception occurred"),
        )
    )
    results = session.execute(query).fetchall()
    return [int(row[0]) for row in results]


# Failure counter
failure_count = 0
MAX_FAILURES = 10

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
            Column("title", String(255), nullable=False),
            Column("occurred", String(255), nullable=True),
            Column("reported", String(255), nullable=True),
            Column("details", JSON, nullable=True),
            Column("description", Text, nullable=True),
            Column("posted", String(255), nullable=True),
            Column("fetched", DateTime, nullable=True),
            Column("RAW", LONGTEXT, nullable=True),
        )

        try:
            last_record = last_record_id()
        except Exception as e:
            print(f"Failed to get last record ID: {e}")
            print("Continuing with current UFO ID without checking the last record...")

        while True:

            ids_to_clean_up = check_missed_records(ufos_table, session)

            if ids_to_clean_up:
                print(
                    f"Found {len(ids_to_clean_up)} records to re-fetch: {ids_to_clean_up}"
                )
                for ufo_id in ids_to_clean_up:
                    try:
                        data, f_count = fetchUfo(ufo_id)
                        update_statement = (
                            update(ufos_table)
                            .where(ufos_table.c.id == ufo_id)
                            .values(**data)
                        )
                        session.execute(update_statement)
                        print(f"Ufo {ufo_id} updated")

                        failure_count = f_count

                    except SQLAlchemyError as e:
                        print(f"Database error for ID {ufo_id}: {e}")
                        update_statement = (
                            update(ufos_table)
                            .where(ufos_table.c.id == ufo_id)
                            .values(
                                title=f"NUFORC UFO Sighting {ufo_id}",
                                RAW=f"Database Exception occurred: {e}",
                            )
                        )
                        session.execute(update_statement)

                        failure_count += 1

                    session.commit()

                    time_to_wait = random.uniform(2, 5)
                    print(
                        f"Waiting for {time_to_wait:.2f} seconds before the next request..."
                    )
                    time.sleep(time_to_wait)

            else:
                print("No records to re-fetch. Starting fresh fetch...")
                while failure_count < MAX_FAILURES:
                    query = select(ufos_table).order_by(ufos_table.c.id.desc()).limit(1)
                    ufo_id = session.execute(query).scalar() + 1

                    if ufo_id > last_record:
                        print("Reached the last available record. Exiting...")
                        sys.exit(0)

                    try:
                        data, f_count = fetchUfo(ufo_id, failure_count)
                        insert_statement = insert(ufos_table).values(**data)
                        session.execute(insert_statement)
                        print(f"Ufo {ufo_id} inserted")
                        print(f"Current failure count: {f_count}")

                        failure_count = f_count

                    except SQLAlchemyError as e:
                        print(f"Database error for ID {ufo_id}: {e}")
                        insert_statement = insert(ufos_table).values(
                            title=f"NUFORC UFO Sighting {ufo_id}",
                            RAW=f"Database Exception occurred: {e}",
                        )
                        session.execute(insert_statement)

                        failure_count += 1

                    session.commit()

                    if failure_count >= MAX_FAILURES:
                        print(
                            f"Exceeded {MAX_FAILURES} consecutive failures. Killing process..."
                        )
                        sys.exit(1)

                    time_to_wait = random.uniform(2, 5)
                    print(
                        f"Waiting for {time_to_wait:.2f} seconds before the next request..."
                    )
                    time.sleep(time_to_wait)

except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)
