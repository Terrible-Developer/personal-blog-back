import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PostLike extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'postid' })
  public postId: number

  @column({ columnName: 'userid' })
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
