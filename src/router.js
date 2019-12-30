import UniversalRouter from 'universal-router';
import routes from './routes';

export default new UniversalRouter(routes, {
  async resolveRoute(context, params) {
    if (typeof context.route.load === 'function') {
      return (await context.route.load()).default(context, params);
    }
    if (typeof context.route.action === 'function') {
      return context.route.action(context, params);
    }
    return undefined;
  },
});
