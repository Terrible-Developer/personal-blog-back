import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostLike extends BaseModel {

  public static table = 'posts_like_users'

  @column({ isPrimary: true })
  public id: number

  /*
   * There should be only one record containing the same post and user ids, it should not be duplicated
   */

  @column({ columnName: 'postid' })
  public postId: number

  @column({ columnName: 'userid' })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
