import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const directory = path.resolve(__dirname, '..', '..', 'tmp');
export default {
  directory,
  storage: multer.diskStorage({
    destination: directory,
    filename(request, file, callback) {
      const hash = crypto.randomBytes(10).toString('HEX');
      const filename = `${hash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
