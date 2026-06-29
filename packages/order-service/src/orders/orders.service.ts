import {
  Injectable, OnModuleInit, Inject,
  BadRequestException, NotFoundException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

interface ProductGrpcService {
  checkAvailability(data: { productId: string; quantity: number }): Observable<{ available: boolean; currentStock: number; message: string }>;
  getProduct(data: { id: string }): Observable<any>;
  getProductsByIds(data: { ids: string[] }): Observable<{ products: any[] }>;
  decrementStock(data: { productId: string; quantity: number }): Observable<{ success: boolean; updatedStock: number }>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private productService: ProductGrpcService;

  constructor(
    @InjectRepository(Order)     private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @Inject('PRODUCT_PACKAGE')   private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductGrpcService>('ProductService');
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    // 1. Validate availability for every item upfront
    for (const item of dto.items) {
      const avail = await firstValueFrom(
        this.productService.checkAvailability({ productId: item.productId, quantity: item.quantity }),
      );
      if (!avail.available) {
        throw new BadRequestException(`Product ${item.productId}: ${avail.message}`);
      }
    }

    // 2. Fetch product details for denormalisation
    const productIds = dto.items.map(i => i.productId);
    const { products } = await firstValueFrom(
      this.productService.getProductsByIds({ ids: productIds }),
    );
    const productMap = new Map(products.map(p => [p.id, p]));

    const orderItems: Partial<OrderItem>[] = dto.items.map(item => {
      const product = productMap.get(item.productId);
      if (!product) throw new BadRequestException(`Product ${item.productId} not found`);
      return {
        id:          uuidv4(),
        productId:   item.productId,
        productName: product.name,
        imageUrl:    product.imageUrl ?? null,
        quantity:    item.quantity,
        unitPrice:   Number(product.price),
      };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.unitPrice! * i.quantity!, 0);

    // 3. Atomically decrement stock for every item BEFORE saving the order.
    //    If any decrement fails the order is never persisted.
    for (const item of dto.items) {
      const result = await firstValueFrom(
        this.productService.decrementStock({ productId: item.productId, quantity: item.quantity }),
      );
      if (!result.success) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
      }
    }

    // 4. All stock reserved — persist the order
    const order = this.orderRepo.create({
      id:          uuidv4(),
      status:      OrderStatus.PENDING,
      totalAmount,
      items:       orderItems as OrderItem[],
      userEmail:   dto.userEmail ?? null,
      address:     dto.address ? JSON.stringify(dto.address) : null,
    });

    return this.orderRepo.save(order);
  }

  async findAll(userEmail?: string): Promise<any[]> {
    const orders = await this.orderRepo.find({
      where: userEmail ? { userEmail } : {},
      order: { createdAt: 'DESC' },
      take: 50,
    });

    const productIds = [...new Set(orders.flatMap(o => o.items.map(i => i.productId)))];
    if (productIds.length === 0) return orders;

    const { products } = await firstValueFrom(
      this.productService.getProductsByIds({ ids: productIds }),
    );
    const productMap = new Map(products.map(p => [p.id, p]));

    return orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        imageUrl: item.imageUrl ?? productMap.get(item.productId)?.imageUrl ?? null,
      })),
    }));
  }

  async findOne(id: string): Promise<any> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);

    const productIds = order.items.map(i => i.productId);
    const { products } = await firstValueFrom(
      this.productService.getProductsByIds({ ids: productIds }),
    );
    const productMap = new Map(products.map(p => [p.id, p]));

    return {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        imageUrl: item.imageUrl ?? productMap.get(item.productId)?.imageUrl ?? null,
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    order.status = dto.status;
    return this.orderRepo.save(order);
  }

  async cancel(id: string): Promise<void> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);
  }
}
