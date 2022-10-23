import { Migration } from '@mikro-orm/migrations';

export class Migration20221022052813 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "friendship" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "initiator_id" int not null);');

    this.addSql('create table "user_friedships" ("user_id" int not null, "friendship_id" int not null, constraint "user_friedships_pkey" primary key ("user_id", "friendship_id"));');

    this.addSql('alter table "friendship" add constraint "friendship_initiator_id_foreign" foreign key ("initiator_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_friedships" add constraint "user_friedships_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friedships" add constraint "user_friedships_friendship_id_foreign" foreign key ("friendship_id") references "friendship" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_friedships" drop constraint "user_friedships_friendship_id_foreign";');

    this.addSql('drop table if exists "friendship" cascade;');

    this.addSql('drop table if exists "user_friedships" cascade;');
  }

}
