import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import Transactionsrepository  from '../repositories/TransactionsRepository';
import { response } from 'express';


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(Transactionsrepository);

    const transaction = await transactionRepository.findOne({where: { id }});

    if(!transaction){
      throw new AppError('transaction does not exist',400);
    }

    const res = await transactionRepository.delete(id);

    if(!res){
      throw new AppError('error with this operation',400);
    }
  }
}

export default DeleteTransactionService;
