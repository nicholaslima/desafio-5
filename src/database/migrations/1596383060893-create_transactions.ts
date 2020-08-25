import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createTransactions1596383060893 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                  {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()'
                  },
                  {
                    name: 'title',
                    type: 'varchar',
                  },
                  {
                    name: 'value',
                    type: 'varchar'
                  },
                  {
                    name:'type',
                    type: 'varchar',
                  },
                  {
                    name: 'category_id',
                    type: 'uuid'
                  },
                  {
                    name:'created_at',
                    type:'Timestamp with time zone',
                    default: 'now()'
                  },
                  {
                    name:'updated_at',
                    type:'Timestamp with time zone',
                    default: 'now()'
                  }
                ]
            })
      )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('transactions');
    }


}
