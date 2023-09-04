import { DateTime } from "luxon";
import { BaseModel, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";

import PostLike from "./PostLike";
import PostComment from "./PostComment";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public slug: string;

  @column()
  public content: string;

  @column()
  public likes_quantity: number;

  @column()
  public tags: string[];

  @column({ columnName: "userid" })
  public userid: number;

  @hasMany(() => PostLike, { foreignKey: "postId" })
  public postLikes: HasMany<typeof PostLike>;

  @hasMany(() => PostComment, { foreignKey: "postId" })
  public postComments: HasMany<typeof PostComment>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
