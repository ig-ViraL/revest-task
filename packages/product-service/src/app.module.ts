import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH ?? join(__dirname, '../product.sqlite'),
      entities: [Product],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ProductsModule,
  ],
})
export class AppModule {}
