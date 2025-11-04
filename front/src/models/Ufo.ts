import sequelize from "../lib/mysql/db";
import { DataTypes, Model, type Optional } from "sequelize";

interface UfoAttributes {
  id: number;
  title: string;
  occurred?: string | null;
  reported?: string | null;
  posted?: string | null;
  location?: object | null; // JSON
  coordinates?: { latitude: number; longitude: number } | null; // JSON
  details?: object | null; // JSON
  description?: string | null;
  fetched?: Date | null;
  RAW?: string | null;
}

interface UfoCreationAttributes extends Optional<UfoAttributes, "id"> {}

class Ufo
  extends Model<UfoAttributes, UfoCreationAttributes>
  implements UfoAttributes
{
  declare id: number;
  declare title: string;
  declare occurred?: string | null;
  declare reported?: string | null;
  declare posted?: string | null;
  declare location?: object | null;
  declare coordinates?: { latitude: number; longitude: number } | null;
  declare details?: object | null;
  declare description?: string | null;
  declare fetched?: Date | null;
  declare RAW?: string | null;
}

Ufo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment:
        "Title of the sighting entry, typically formatted as “NUFORC UFO Sighting [ID]”.",
    },
    occurred: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Date and local time when the event was witnessed.",
    },
    reported: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment:
        "Date and time (with timezone) when the sighting was reported to NUFORC.",
    },
    posted: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Date NUFORC published the report on their site.",
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "JSON object containing textual information about the sighting’s geographic area (e.g., city, state, country).",
    },
    coordinates: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "JSON object with geospatial coordinates (latitude and longitude) of the sighting location.",
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "Structured JSON metadata including duration, observers, location, shape, and other notes.",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Narrative account provided by the witness.",
    },
    fetched: {
      type: DataTypes.DATE,
      allowNull: true,
      comment:
        "Timestamp when the record was retrieved or last scraped from NUFORC.",
    },
    RAW: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      comment:
        "Raw HTML content of the NUFORC webpage containing the sighting.",
    },
  },
  {
    sequelize,
    tableName: "UFOS",
    // underscored: false, // use true if you want snake_case naming
  }
);

export default Ufo;
