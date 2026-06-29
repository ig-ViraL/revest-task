import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'product.sqlite',
      entities: [Product],
      synchronize: true,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
