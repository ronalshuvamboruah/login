const express = require('express');
const util = require('util');

const router = express.Router();

const controllerModule = require('../controllers/userController');
const auth = require('../middlewares/auth'); // <-- added

// DEBUG: show what was imported
console.log('DEBUG userController export type:', typeof controllerModule);
console.log('DEBUG userController export value:', util.inspect(controllerModule, { depth: 2 }));

let handlers = {};

// support class, { default: Class }, or plain object of handlers
if (typeof controllerModule === 'function') {
  const instance = new controllerModule();
  handlers.createUser = instance.createUser && instance.createUser.bind(instance);
  handlers.listUsers = instance.listUsers && instance.listUsers.bind(instance);
  handlers.getUser = instance.getUser && instance.getUser.bind(instance);
  handlers.deleteUser = instance.deleteUser && instance.deleteUser.bind(instance);
} else if (controllerModule && typeof controllerModule.default === 'function') {
  const instance = new controllerModule.default();
  handlers.createUser = instance.createUser && instance.createUser.bind(instance);
  handlers.listUsers = instance.listUsers && instance.listUsers.bind(instance);
  handlers.getUser = instance.getUser && instance.getUser.bind(instance);
  handlers.deleteUser = instance.deleteUser && instance.deleteUser.bind(instance);
} else if (controllerModule && (controllerModule.createUser || controllerModule.getUser)) {
  handlers.createUser = controllerModule.createUser;
  handlers.listUsers = controllerModule.listUsers;
  handlers.getUser = controllerModule.getUser;
  handlers.deleteUser = controllerModule.deleteUser;
}

console.log('DEBUG handlers:', {
  createUser: typeof handlers.createUser,
  listUsers: typeof handlers.listUsers,
  getUser: typeof handlers.getUser,
  deleteUser: typeof handlers.deleteUser
});

// --- logger setup (uses src/utils/logger if present, otherwise falls back to console) ---
let logger;
try {
  logger = require('../utils/logger');
} catch (e) {
  logger = {
    info: (...args) => console.log('[info]', ...args),
    error: (...args) => console.error('[error]', ...args),
    debug: (...args) => console.debug('[debug]', ...args)
  };
}

// wrapper to log request start/end and errors for async handlers
const withLogging = (handler) => {
  if (typeof handler !== 'function') {
    return (req, res, next) => {
      logger.error('Handler is not a function for route', req.method, req.originalUrl);
      res.status(500).json({ message: 'Server misconfiguration' });
    };
  }

  return async (req, res, next) => {
    const start = Date.now();
    logger.info(`${new Date().toISOString()} ${req.method} ${req.originalUrl} - start`);
    logger.debug('request body:', util.inspect(req.body, { depth: 2 }));

    try {
      await handler(req, res, next);
      const duration = Date.now() - start;
      logger.info(`${new Date().toISOString()} ${req.method} ${req.originalUrl} - done - status ${res.statusCode} - ${duration}ms`);
    } catch (err) {
      logger.error(`${new Date().toISOString()} ${req.method} ${req.originalUrl} - error -`, err && err.message);
      next(err);
    }
  };
};

// use '/' so mounted app.use('/api/users', userRoutes) -> POST /api/users, GET /api/users
router.post('/', withLogging(handlers.createUser));
router.get('/', withLogging(handlers.listUsers));
// protect this route with auth middleware so token is required
router.get('/:id', auth, withLogging(handlers.getUser));
router.delete('/:id', withLogging(handlers.deleteUser));

module.exports = router;