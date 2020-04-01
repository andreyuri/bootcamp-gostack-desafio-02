import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryManagementController from './app/controllers/DeliveryManagementController';
import DeliveryWithdrawalsController from './app/controllers/DeliveryWithdrawalsController';
import DeliveryCompletedController from './app/controllers/DeliveryCompletedController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import OrderProblemController from './app/controllers/OrderProblemController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymans/:id/deliveries', DeliveryManagementController.index);

routes.put(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId/withdrawals',
  DeliveryWithdrawalsController.update
);

routes.put(
  '/deliverymans/:deliverymanId/deliveries/:deliveryId/completed',
  DeliveryCompletedController.update
);

routes.get('/deliveries/problems', DeliveryProblemController.index);

routes.get('/delivery/:deliveryId/problems', OrderProblemController.index);
routes.post('/delivery/:deliveryId/problems', OrderProblemController.store);
routes.delete('/delivery/:deliveryId/problems', OrderProblemController.delete);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.get('/deliverymans', DeliverymanController.index);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

export default routes;
