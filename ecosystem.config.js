module.exports = {
  apps: [
    {
      name: 'Daelimi-server',
      exec_mode: 'cluster',
      instances: 2,
      script: 'npm',
      args: 'start'
    }
  ]
}
