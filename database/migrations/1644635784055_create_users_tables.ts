import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('username', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('email', 255).unique().notNullable()
      table.string('remember_me_token').nullable()

      table.timestamps(true, true)
      //table.timestamp('created_at', { useTz: true }).notNullable()
      //table.timestamp('updated_at', { useTz: true }).notNullable()
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
