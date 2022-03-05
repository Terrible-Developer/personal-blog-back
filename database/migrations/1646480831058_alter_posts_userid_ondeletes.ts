import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('userid')
      table.integer('userid').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE').alter()
    })
  }

  public async down () {
  }
}
