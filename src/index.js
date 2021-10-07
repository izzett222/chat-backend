import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './routes';

config();
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', async (req, res) => res.send('welcome to chat backend'));
app.use('/api', routes);
const port = process.env.PORT || 3006;
app.listen(port, () => process.stdout.write(`Server is running on http://localhost:${port}/api`));
