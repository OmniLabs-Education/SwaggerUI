import express from 'express';
import {routes} from './routes';

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json'

const app = express();
app.use(express.json());
app.use(routes)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.listen(2222);