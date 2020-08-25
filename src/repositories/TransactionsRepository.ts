import { EntityRepository, Repository,getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}


@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {


  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const { income,outcome } = transactions.reduce(
      (balance: Balance,transaction: Transaction) => {
          switch(transaction.type){
            case 'income':
              balance.income += Number(transaction.value);
              break;
            case 'outcome':
              balance.outcome += Number(transaction.value);
              break;
            default:
            break;
          }
          return balance;
     },{
        income: 0,
        outcome :0,
        total: 0
     });

     const balance = {
       income,
       outcome,
       total: income - outcome
     }

     return balance;
  }
}

export default TransactionsRepository;
