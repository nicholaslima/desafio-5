

import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const destino = path.resolve('_dirname_','..','tmp');

export default {
    directory: destino,
    storage: multer.diskStorage({
        destination: destino,
        filename: (request,file,callback) => {
          const hash = crypto.randomBytes(10).toString('HEX');
          const name = `${hash}-${file.originalname}`;
          return callback(null,name);
        }
    })
}
