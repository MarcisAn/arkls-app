import { Migration } from '@mikro-orm/migrations';

export class Migration20221027172045 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "category" varchar(255) not null, add column "points" real not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" drop column "category";');
    this.addSql('alter table "task" drop column "points";');
  }

}
