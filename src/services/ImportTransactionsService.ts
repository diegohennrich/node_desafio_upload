import { Request } from 'express';
import { getRepository } from 'typeorm';
import csv from 'csvtojson';
import path from 'path';
import fs from 'fs';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import uploadConfig from '../config/multer';

class ImportTransactionsService {
  public async execute(request: Request): Promise<Transaction[]> {
    const { file } = request;

    const RepositoryCategory = getRepository(Category);
    const RepositoryTransaction = getRepository(Transaction);

    // const filePath = path.join(uploadConfig.directory, file.originalname);
    const filePath = path.join(uploadConfig.directory, file.filename);
    const exists = await fs.promises.stat(filePath);
    const group: Transaction[] = [];

    if (exists) {
      const jsonArray = await csv({
        noheader: true,
        trim: true,
        delimiter: ',',
      }).fromFile(filePath);

      jsonArray.shift();

      for (const i of jsonArray) {
        let category_id;

        const cat = await RepositoryCategory.findOne({
          where: { title: i.field4 },
        });

        if (cat) {
          category_id = cat.id;
        } else {
          const newCategory = await RepositoryCategory.create({
            title: i.field4,
          });
          await RepositoryCategory.save(newCategory);

          category_id = newCategory.id;
        }

        const newTrans = await RepositoryTransaction.create({
          title: i.field1,
          type: i.field2,
          value: i.field3,
          category_id,
        });

        await RepositoryTransaction.save(newTrans);

        group.push(newTrans);
      }
    }

    return group;
  }
}

export default ImportTransactionsService;
