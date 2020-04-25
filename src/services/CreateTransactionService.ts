import { getRepository, getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionDTO): Promise<Transaction> {
    const Repository = getRepository(Transaction);
    const RepositoryCategory = getRepository(Category);
    let category_id;

    const cat = await RepositoryCategory.findOne({
      where: { title: category },
    });

    if (cat) {
      category_id = cat.id;
    } else {
      const newCategory = await RepositoryCategory.create({ title: category });
      await RepositoryCategory.save(newCategory);

      category_id = newCategory.id;
    }

    const newTrans = await Repository.create({
      title,
      value,
      type,
      category_id,
    });

    await Repository.save(newTrans);

    return newTrans;
  }

  public async findAll(): Promise<Response> {
    const Repository = getRepository(Transaction);
    const customRepository = getCustomRepository(TransactionsRepository);
    const transactions = await Repository.find({ relations: ['category_id'] });

    const balance = await customRepository.getBalance(transactions);

    return {
      transactions,
      balance,
    };
  }
}

export default CreateTransactionService;
