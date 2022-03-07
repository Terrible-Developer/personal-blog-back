import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import PostLike from './PostLike'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public email: string

  @column()
  public rememberMeToken?: string

  @column()
  public isAdmin: boolean

  @hasMany(() => Post, { foreignKey: 'userId' })
  public posts: HasMany<typeof Post>

  @hasMany(() => PostLike, { foreignKey: 'userId' })
  public postLikes: HasMany<typeof PostLike>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
