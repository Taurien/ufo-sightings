# RECS. 3511 n 3514 not registered
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

# ... rest of your code

# Database credentials
hostname = "localhost:3306"
username = "root"
password = "Qwerty8975_"
database = "nuforc"

try:
    # Create the database connection engine
    engine = create_engine(
        f"mysql+mysqlconnector://{username}:{password}@{hostname}/{database}"
    )

    # Try to connect to the database
    with engine.connect() as connection:
        print("Connection to the MySQL database was successful!")

except SQLAlchemyError as e:
    # This block will run if there's an error in the connection
    print(f"Error connecting to the database: {e}")

# Path to your Excel file and table name
excel_file_path = "nuforc_dataset.xlsx"
table_name = "UFOS"

# Read the Excel file into a Pandas DataFrame
df = pd.read_excel(excel_file_path)

# --- Update these lines to handle the missing data ---
# Fill empty titles with 'PEND'
df["title"] = df["title"].fillna("PEND")

# Fill all other empty cells with a placeholder that will be interpreted as NULL in SQL
df = df.replace({np.nan: None})

# Convert the 'fetched' column to the correct datetime format
df["fetched"] = pd.to_datetime(df["fetched"], format="ISO8601")

# Remove the 'id' column since it's auto_increment
if "id" in df.columns:
    df = df.drop(columns=["id"])

# Upload the DataFrame to your MySQL table
df.to_sql(table_name, con=engine, if_exists="append", index=False)

print(
    f"Excel file '{excel_file_path}' has been successfully uploaded to the MySQL table '{table_name}'."
)
