import {fileURLToPath} from 'url';
import {dirname} from 'path';

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);
//global.admin = true;                     //////

export const authMiddleware = (req, res, next) => {
  if (!req.auth) res.status(403).send({ error: -2, message: "No autorizado" });
  else next();
};

export default __dirname;