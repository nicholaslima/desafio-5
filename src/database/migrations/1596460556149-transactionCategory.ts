import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class transactionCategory1596460556149 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('transactions',
            new TableForeignKey({
              name: 'transactionCategory',
              columnNames: ['category_id'],
              referencedColumnNames: ['id'],
              referencedTableName: 'categories',
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL'
            }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.dropForeignKey('transactions','transactionCategory');
    }

}
