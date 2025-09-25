# Database credentials
hostname = "localhost:3306"
username = "root"
password = "Qwerty8975_"
database = "nuforc"

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
            # Column("details", JSON, nullable=True),
            # Column("description", Text, nullable=True),
            Column("RAW", LONGTEXT, nullable=True),
        )

        query = select(ufos_table)
        results = session.execute(query).fetchall()

        for row in results:
            RAW_data = row[2]
            processed_data = process_raw(RAW_data)
            update_stmt = (
                update(ufos_table).where(ufos_table.c.id == row[0])
                # .values(details=processed_data.details)
                # .values(description=processed_data.description)
            )
            # session.execute(update_stmt)
        # session.commit()

except SQLAlchemyError as e:
    print(f"Error connecting to the database: {e}")
    sys.exit(1)
