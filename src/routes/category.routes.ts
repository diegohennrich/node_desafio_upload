import { Router } from 'express';

import CreateCategoryService from '../services/CreateCategoryService';

const createCategoryService = new CreateCategoryService();
const categoryRoutes = Router();

categoryRoutes.post('/', async (req, res) => {
  const { body } = req;
  const { title } = body;

  const category = await createCategoryService.execute(title);
  res.json(category);
});

export default categoryRoutes;
