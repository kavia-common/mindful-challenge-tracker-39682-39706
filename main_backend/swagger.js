const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Feel The Pain API',
      version: '1.0.0',
      description: 'REST API for the Feel The Pain app. Theme: Ocean Professional (primary #2563EB, secondary #F59E0B, error #EF4444).',
      contact: {
        name: 'Mindful Challenge Tracker',
      },
    },
    servers: [{ url: '/' }],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
