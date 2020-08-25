


import Transaction from '../models/Transaction';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';
import csvParse from 'csv-parse';
import transactionsRouter from '../routes/transactions.routes';
import { getRepository,getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import transactionsService from '../services/CreateTransactionService';
import AppError from '../errors/AppError';


interface lista{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]>{

    const pathFile = path.join(uploadConfig.directory,filename);
    const importFileExists = await fs.promises.stat(pathFile);

    if (!importFileExists) {
      throw new AppError('Import file not exist.');
    }

      const csvstream =  fs.createReadStream(pathFile);

      const parseStream = csvParse({
        from_line: 2,
        ltrim: true,
        rtrim: true,
      })

      const parseCSV = csvstream.pipe(parseStream);

      let list:any = [];

      parseCSV.on('data', line => {
          const [ title,type,value,category ] = line;

          list.push([ title,type,value,category ]);
      });

      await new Promise(resolve => {
        parseCSV.on('end', resolve);
      });

      const transactionRepository = getRepository(Transaction);
      const categoryRepository = getRepository(Category);

      let categories:any = [];
      let transactions:any = [];

      for(const item of list){
        const [ title,type,value,category ] = item.map((item:string) => {
          return item.trim();
        });

        let found = await categoryRepository.findOne({
          where:{ title: category}
        })

        if(!found){
            const exist = categories.some( (item: Category ) =>  item.title === category);

            if(!exist){
              const newCategory = categoryRepository.create( { title: category } );
              categories.push(newCategory);
            }
        }

        const transaction = transactionRepository.create({
          title,
          type,
          value,
          category: found ? found : category
        })


       transactions.push(transaction);
     };

     const newCategories = await categoryRepository.save(categories);

     for(var i = 0; i < transactions.length;i++){
       if(typeof transactions[i].category === 'string'){
          for(var u = 0; u < newCategories.length;u++){
            if(transactions[i].category === newCategories[u].title){
              transactions[i].category = newCategories[u];
            }
          }
       }
     }


   await transactionRepository.save(transactions);
   await fs.promises.unlink(pathFile);

    return transactions;
}}

export default ImportTransactionsService;
