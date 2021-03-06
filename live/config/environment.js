/* jshint node: true */

module.exports = function (environment) {
  var ENV = {
    modulePrefix: 'pix-live',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      // XXX because of a deprecation notice in the console
      EXTEND_PROTOTYPES: {
        Date: false
      },
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      useDelay: true
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      API_HOST: '/'
    },

    googleFonts: [
      'Lato:300,300i,400,400i,600,600i,700,700i', // main font
      'Open+Sans:300,300i,400,400i,600,600i,700,700i' // used for ex. on buttons
    ],

    // Set or update content security policies
    contentSecurityPolicy: {
      'font-src': "'self' fonts.gstatic.com",
      'style-src': "'self' fonts.googleapis.com"
    }
  };

  if (environment === 'development') {
    // LOG
    ENV.APP.LOG_RESOLVER = false;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_TRANSITIONS = false;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    // Redefined in custom initializer 'initializers/configure-pix-api-host.js'
    ENV.APP.API_HOST= 'http://localhost:3000'
  }

  if (environment === 'test') {
    ENV.EmberENV.useDelay = false;

    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.googleFonts = [];
    ENV.APP.API_HOST= 'http://localhost:3000';
  }

  if (environment === 'integration') {
    ENV.metricsAdapters = [
      {
        name: 'Piwik',
        environments: ['integration'],
        config: {
          piwikUrl: '//stats.data.gouv.fr',
          siteId: 30
        }
      }
    ];
  }

  if (environment === 'staging') {
    ENV.metricsAdapters = [
      {
        name: 'Piwik',
        environments: ['staging'],
        config: {
          piwikUrl: '//stats.data.gouv.fr',
          siteId: 31
        }
      }
    ];
  }

  if (environment === 'production') {
    ENV.metricsAdapters = [
      {
        name: 'Piwik',
        environments: ['production'],
        config: {
          piwikUrl: '//stats.data.gouv.fr',
          siteId: 29
        }
      }
    ];
  }


  return ENV;
};
