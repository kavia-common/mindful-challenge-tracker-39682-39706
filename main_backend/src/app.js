const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host');           // may or may not include port
  let protocol = req.protocol;          // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
     (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body and cookies
app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/', routes);

// Error handling middleware (Ocean Professional)
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack || err);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    theme: 'Ocean Professional',
    color: '#EF4444',
    code: err.code || 'internal_error',
    message: status === 500 ? 'An unexpected error occurred. Please try again.' : (err.message || 'Request failed'),
  });
});

module.exports = app;
