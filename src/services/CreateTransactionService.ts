import AppError from '../errors/AppError';
import { getCustomRepository,getRepository } from 'typeorm';
import transactionRespository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title,value,type,category }:Request): Promise<Transaction> {

  const transactionRepository =  getCustomRepository(transactionRespository);
  const categoryRepository =  getRepository(Category);

  const balance = await transactionRepository.getBalance();

  if(type === 'outcome' && value > balance.total){
    throw new AppError('you dont have this value in your acount',400);
  }

    let found = await categoryRepository.findOne({ where: { title:category } });

    if(!found){
      found = categoryRepository.create({ title: category });
      await categoryRepository.save(found);
    }

    const transaction = transactionRepository.create(
      {
        title,
        value,
        type,
        category_id: found.id
      }
    );

    const saved = await transactionRepository.save(transaction);


    return transaction;
  }
}

export default CreateTransactionService;
