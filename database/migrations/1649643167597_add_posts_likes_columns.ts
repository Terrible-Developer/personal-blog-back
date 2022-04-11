import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddPostsLikesColumns extends BaseSchema {
  protected tableName = 'posts'
  protected columnName = 'likes_quantity';

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.bigInteger(this.columnName)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn(this.columnName)
    })
  }
}
