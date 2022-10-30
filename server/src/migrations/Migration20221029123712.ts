import { Migration } from '@mikro-orm/migrations';

export class Migration20221029123712 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "comment" add column "text" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop column "text";');
  }

}
