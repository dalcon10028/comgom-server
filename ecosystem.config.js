module.exports = {
  apps: [
    {
      name: 'Daelimi-server',
      exec_mode: 'cluster',
      instances: 2,
      script: 'npm',
      args: 'start',
      env_production: {
        HOST: '0.0.0.0',
        PORT: 1337,
        NODE_ENV: 'production'
      }
    }
  ]
}