import { Migration } from '@mikro-orm/migrations';

export class Migration20221007174114 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "first_name";');
    this.addSql('alter table "user" drop column "last_name";');
    this.addSql('alter table "user" drop column "birth_date";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" add column "first_name" text not null, add column "last_name" text not null, add column "birth_date" timestamptz(0) null;');
  }

}
