import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProxyMiddleware } from './middleware/proxy.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (if needed)
  app.enableCors();

  // Apply proxy middleware
  app.use(new ProxyMiddleware().use);

  await app.listen(3500);
  console.log('NestJS running on http://localhost:3500');
}
bootstrap();


