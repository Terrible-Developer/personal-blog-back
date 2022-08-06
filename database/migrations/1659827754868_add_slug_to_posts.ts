import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Posts extends BaseSchema {
  protected tableName = "posts";
  protected columnName = "slug";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text(this.columnName);
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn(this.columnName);
    });
  }
}
