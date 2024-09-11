module.exports = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Express API',
        version: '1.0.0',
        description: 'API documentation',
      },
    },
    apis: ['./routes/*.js'], // Path to the API docs
  };