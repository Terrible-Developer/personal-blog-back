/*import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class AddPostCommentsColumnToPosts extends BaseSchema {
  protected tableName = "posts";
  protected columnName = "post_comments";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer("post_comments_id").unsigned();
      table.foreign("post_comments_id").references("post_comments.id");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
*/
