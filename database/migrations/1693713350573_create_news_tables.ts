import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateNewsTables extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("title").notNullable();
      table.string('content').notNullable();
      table.timestamps(true, true);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
