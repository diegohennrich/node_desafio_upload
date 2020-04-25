import { Router } from 'express';
import multer from 'multer';
import configMulter from '../config/multer';
// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';

const upload = multer(configMulter);

const deleteService = new DeleteTransactionService();
const createTransactionsService = new CreateTransactionService();
const importService = new ImportTransactionsService();

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactions = await createTransactionsService.findAll();

  response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { body } = request;
  const { title, value, type, category } = body;

  const { balance } = await createTransactionsService.findAll();
  const { total } = balance;

  if (type === 'outcome' && value > total) {
    throw new AppError('You do not have this value to outcome', 400);
  }

  const transaction = await createTransactionsService.execute({
    title,
    value,
    type,
    category,
  });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { params } = request;
  const { id } = params;

  await deleteService.execute(id);

  response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const trans = await importService.execute(request);

    response.json(trans);
  },
);

export default transactionsRouter;
