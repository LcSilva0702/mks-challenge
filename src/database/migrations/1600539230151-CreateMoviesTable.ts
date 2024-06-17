import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMoviesTable1600539230151 implements MigrationInterface {
  private table = new Table({
    name: 'movies',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'title',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'release',
        type: 'string',
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
