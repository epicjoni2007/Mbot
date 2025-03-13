import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with custom options
  app.enableCors({
    origin: 'http://10.10.1.50:5173',  // Allow only the frontend's domain
    methods: 'GET, POST',  // Limit the allowed methods
  });
  await app.listen(process.env.PORT ?? 3500);  // Listen on the provided port or fallback to 3500
}

bootstrap();
