import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class PostComments extends BaseSchema {
  protected tableName = "post_comments";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("content").notNullable();
      table.integer("userid").unsigned().notNullable();
      table.integer("postId").unsigned().notNullable();
      table.timestamps(true, true);

      table.foreign("userid").references("users.id");
      table.foreign("postId").references("posts.id");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      /*table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })*/
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
