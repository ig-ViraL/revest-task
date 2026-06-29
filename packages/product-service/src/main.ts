import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ?? 3001;
  const grpcPort = process.env.GRPC_PORT ?? 50051;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath: join(__dirname, '../../../proto/product.proto'),
      url: `0.0.0.0:${grpcPort}`,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`Product Service REST → http://localhost:${port}`);
  console.log(`Product Service gRPC → localhost:${grpcPort}`);
}
bootstrap();
