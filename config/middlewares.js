module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '50mb', // Increase form payload size limit
      jsonLimit: '50mb', // Increase JSON payload size limit
      textLimit: '50mb', // Increase text payload size limit
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // Increase file size limit (e.g., 200MB)
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];