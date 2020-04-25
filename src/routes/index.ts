import { Router } from 'express';

import transactionsRouter from './transactions.routes';
import categoryRoutes from './category.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use('/category', categoryRoutes);

export default routes;
