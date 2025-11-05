import os
from dotenv import load_dotenv
import sys
from sqlalchemy import (
    update,
    JSON,
    create_engine,
    select,
    Table,
    MetaData,
    Column,
    Integer,
    Text,
)
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from processRAWfunc import process_raw

load_dotenv()

hostname = os.getenv("DB_HOST")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
database = os.getenv("DB_NAME")


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
            # Column("location", JSON, nullable=True),
            # Column("details", JSON, nullable=True),
            # Column("description", Text, nullable=True),
            # Column("RAW", LONGTEXT, nullable=True),
        )

        query = select(ufos_table)
        # query = select(ufos_table).where(ufos_table.c.id == 193463)  # 193255
        # query = select(ufos_table).where(ufos_table.c.location.isnot(None))
        results = session.execute(query).fetchall()

        for row in results:
            print(f"Processing {row}")
            # location_data = row[1]
            # print(f"Location data for ID {row[0]}: {location_data.get('area')}")

            # splitted_location = location_data.get("area").split(", ")
            # country = splitted_location[-1]
            # location_data["country"] = country

            # RAW_data = row[2]
            # processed_data = process_raw(RAW_data)

        #     update_stmt = (
        #         update(ufos_table).where(ufos_table.c.id == row[0])
        #         # .values(details=processed_data.details)
        #         # .values(description=None)
        #     )
        #     session.execute(update_stmt)
        # session.commit()

except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)
