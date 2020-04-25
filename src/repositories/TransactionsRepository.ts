import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(data: Transaction[]): Promise<Balance> {
    const balance = data.reduce(
      (accumulator, curr) => {
        const { type, value } = curr;

        accumulator[type] += Number(value);
        accumulator.total = accumulator.income - accumulator.outcome;
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
