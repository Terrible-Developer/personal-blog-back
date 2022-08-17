import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class PostComment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public content: string;

  @column({ columnName: "userid" })
  public userid: number;

  @column({ columnName: "postId" })
  public postId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}