import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PostsLikeUsers extends BaseSchema {
  protected tableName = 'posts_like_users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('postid').unsigned().references('id').inTable('posts').notNullable()
      table.integer('userid').unsigned().references('id').inTable('users').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable()
  }
}
