import { Migration } from '@mikro-orm/migrations';

export class Migration20221027172206 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" alter column "points" type int using ("points"::int);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "task" alter column "points" type real using ("points"::real);');
  }

}
