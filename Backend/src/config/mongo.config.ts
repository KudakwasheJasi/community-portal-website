import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri:
    process.env.MONGO_URI ||
    'mongodb+srv://Eliijah:YOUR_PASSWORD@cluster0.gbyon2q.mongodb.net/community-portal?retryWrites=true&w=majority&appName=Cluster0',
  useNewUrlParser: true,
  useUnifiedTopology: true,
}));
