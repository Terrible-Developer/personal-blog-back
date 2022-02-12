import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tags extends BaseSchema {
  protected tableName = 'tags'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('tagname').unique().notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
