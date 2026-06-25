import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  callbackUrl: process.env.GOOGLE_CALLBACK_URL,
}));
