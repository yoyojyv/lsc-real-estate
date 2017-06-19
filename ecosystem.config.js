module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'lsc-real-estate',
      script: 'server.js',
      env: {
        NODE_ENV: 'default',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'yoyojyv',
      host: '45.77.30.57',
      ref: 'origin/master',
      repo: 'git@bitbucket.org:yoyojyv/lsc-real-estate.git',
      path: '/var/www/lsc-real-estate',
      'post-deploy': 'npm install && ng build --target=production --environment=prod --aot false && pm2 startOrRestart ecosystem.config.js --env production',
    }
  }
};
