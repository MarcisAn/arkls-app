import { Migration } from '@mikro-orm/migrations';

export class Migration20221025194513 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "task" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null, "title" varchar(255) not null);');

    this.addSql('create table "comment" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int not null, "task_id" int not null);');

    this.addSql('alter table "task" add constraint "task_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_task_id_foreign" foreign key ("task_id") references "task" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "comment" drop constraint "comment_task_id_foreign";');

    this.addSql('drop table if exists "task" cascade;');

    this.addSql('drop table if exists "comment" cascade;');
  }

}
