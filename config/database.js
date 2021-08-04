module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', 'comjung.cx5qkeshvez5.ap-northeast-2.rds.amazonaws.com'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'dalcon'),
        username: env('DATABASE_USERNAME', 'cjadmin'),
        password: env('DATABASE_PASSWORD', 'cjadmin2012!'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
