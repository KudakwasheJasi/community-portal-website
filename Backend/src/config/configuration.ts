interface DatabaseConfig {
  url: string;
}

interface MongoConfig {
  uri: string;
}

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: DatabaseConfig;
  mongo: MongoConfig;
  jwt: JwtConfig;
}

export default (): AppConfig => ({
  // App
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:zz@localhost:1943/community_portal',
  },

  // MongoDB
  mongo: {
    uri:
      process.env.MONGO_URI || 'mongodb://localhost:27017/community-portal-dev',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_key_123',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
