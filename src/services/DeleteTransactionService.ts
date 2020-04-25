import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const Repository = getRepository(Transaction);

    const transaction = await Repository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    await Repository.remove(transaction);
  }
}

export default DeleteTransactionService;
