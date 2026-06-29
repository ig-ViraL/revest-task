import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from './products.service';

@Controller()
export class ProductsGrpcController {
  constructor(private readonly service: ProductsService) {}

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: { id: string }) {
    const p = await this.service.findOne(data.id);
    return this.serialize(p);
  }

  @GrpcMethod('ProductService', 'CheckAvailability')
  checkAvailability(data: { productId: string; quantity: number }) {
    return this.service.checkAvailability(data.productId, data.quantity);
  }

  @GrpcMethod('ProductService', 'GetProductsByIds')
  async getProductsByIds(data: { ids: string[] }) {
    const products = await this.service.findByIds(data.ids);
    return { products: products.map(p => this.serialize(p)) };
  }

  @GrpcMethod('ProductService', 'DecrementStock')
  decrementStock(data: { productId: string; quantity: number }) {
    return this.service.decrementStock(data.productId, data.quantity);
  }

  private serialize(p: any) {
    return {
      ...p,
      price: Number(p.price),
      createdAt: p.createdAt?.toISOString() ?? '',
      updatedAt: p.updatedAt?.toISOString() ?? '',
    };
  }
}
