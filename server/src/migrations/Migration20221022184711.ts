import { Migration } from '@mikro-orm/migrations';

export class Migration20221022184711 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "friendship" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "friendship" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "initiator_id" int not null);');

    this.addSql('alter table "friendship" add constraint "friendship_initiator_id_foreign" foreign key ("initiator_id") references "user" ("id") on update cascade;');
  }

}
