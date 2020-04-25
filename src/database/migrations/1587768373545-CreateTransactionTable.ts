import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTransactionTable1587768373545
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            generationStrategy: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'numeric(10,2)',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'category_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'CategoryId', // nome de referencia apenas
        columnNames: ['category_id'], // coluna na tabela de transaction que será relacionada ao usuário
        referencedColumnNames: ['id'], // coluna na tabela de usuarios que terá o relacionamento com o provider_id
        referencedTableName: 'categories', // nome da tabela que receberá a chave estrangeira de ligacao com o provider_id
        onDelete: 'SET NULL', // acao que deverá ser executada na coluna provider_id quando um usuario relacionado for deletado
        onUpdate: 'CASCADE', // acao que deverá ser executada na coluna provider_id quando um usuario relacionado for atualizado
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('transactions', 'CategoryId');
    await queryRunner.dropTable('transactions');
  }
}
