import { Model, DataTypes, Optional } from "sequelize";
import db from "../database";

export interface UrlAttributes {
  id: number;
  original_url: string;
  short_path: string;
  visit_count: number;
  created_at?: Date;
  updated_at? : Date;
}

type UrlCreationAttributes = Optional<UrlAttributes, "id">;

class Url
  extends Model<UrlAttributes, UrlCreationAttributes>
  implements UrlAttributes
{
  public id!: number;
  public original_url!: string;
  public short_path!: string;
  public visit_count!: number;

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Url.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    original_url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    short_path: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    visit_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: db.sequelize,
    tableName: "urls",
  }
);

export default Url;
