import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'order.sqlite',
      entities: [Order, OrderItem],
      synchronize: true,
    }),
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, '../../../proto/product.proto'),
          url: process.env.PRODUCT_GRPC_URL ?? 'localhost:50051',
        },
      },
    ]),
    OrdersModule,
  ],
})
export class AppModule {}
