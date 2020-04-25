import { getRepository } from 'typeorm';
import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const Repository = getRepository(Category);
    const category = await Repository.findOne({ where: { title } });

    if (category) {
      return category;
    }

    const payload = {
      title,
    };

    const newCategory = await Repository.create(payload);

    await Repository.save(newCategory);
    return newCategory;
  }
}

export default CreateCategoryService;
