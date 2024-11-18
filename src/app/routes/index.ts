import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/order/order.route';
const routers = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach(route => routers.use(route.path, route.route));
export default routers;
