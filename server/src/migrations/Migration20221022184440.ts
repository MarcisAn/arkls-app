import { Migration } from '@mikro-orm/migrations';

export class Migration20221022184440 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user_friends" ("user_1_id" int not null, "user_2_id" int not null, constraint "user_friends_pkey" primary key ("user_1_id", "user_2_id"));');

    this.addSql('alter table "user_friends" add constraint "user_friends_user_1_id_foreign" foreign key ("user_1_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friends" add constraint "user_friends_user_2_id_foreign" foreign key ("user_2_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_friedships" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "user_friedships" ("user_id" int not null, "friendship_id" int not null, constraint "user_friedships_pkey" primary key ("user_id", "friendship_id"));');

    this.addSql('alter table "user_friedships" add constraint "user_friedships_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_friedships" add constraint "user_friedships_friendship_id_foreign" foreign key ("friendship_id") references "friendship" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "user_friends" cascade;');
  }

}
