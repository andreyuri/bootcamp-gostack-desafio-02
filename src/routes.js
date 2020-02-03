import { Router } from 'express';

const routes = new Router();

routes.use('/', (req, res) => {
  res.json({ message: 'bla' });
});

export default routes;
