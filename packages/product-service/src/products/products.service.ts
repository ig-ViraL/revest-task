import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.repo.findOne({ where: { sku: dto.sku } });
    if (existing) throw new ConflictException(`SKU "${dto.sku}" already exists`);
    const product = this.repo.create({ ...dto, id: uuidv4() });
    return this.repo.save(product);
  }

  async findAll(filters?: FindProductsDto): Promise<Product[]> {
    const qb = this.repo.createQueryBuilder('p').where('p.isActive = :active', { active: true });

    if (filters?.name?.trim()) {
      qb.andWhere('(p.name LIKE :name OR p.description LIKE :name)', { name: `%${filters.name.trim()}%` });
    }
    if (filters?.category) {
      qb.andWhere('p.category = :category', { category: filters.category });
    }
    if (filters?.minPrice !== undefined) {
      qb.andWhere('p.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters?.maxPrice !== undefined) {
      qb.andWhere('p.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    return qb.orderBy('p.createdAt', 'DESC').getMany();
  }

  async getCategories(): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('p')
      .select('DISTINCT p.category', 'category')
      .where('p.isActive = :active AND p.category IS NOT NULL', { active: true })
      .getRawMany();
    return rows.map((r: any) => r.category).filter(Boolean).sort();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.repo.find({ where: { id: In(ids), isActive: true } });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async softDelete(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.repo.save(product);
  }

  async checkAvailability(productId: string, quantity: number) {
    const product = await this.repo.findOne({ where: { id: productId } });
    if (!product) return { available: false, currentStock: 0, message: 'Product not found' };
    if (!product.isActive) return { available: false, currentStock: product.stock, message: 'Product is inactive' };
    if (product.stock < quantity) return { available: false, currentStock: product.stock, message: 'Insufficient stock' };
    return { available: true, currentStock: product.stock, message: 'ok' };
  }

  async decrementStock(productId: string, quantity: number) {
    const result = await this.repo
      .createQueryBuilder()
      .update(Product)
      .set({ stock: () => `stock - ${quantity}` })
      .where('id = :id', { id: productId })
      .andWhere('stock >= :qty', { qty: quantity })
      .execute();

    if (!result.affected) return { success: false, updatedStock: 0 };
    const product = await this.repo.findOne({ where: { id: productId }, select: ['stock'] });
    return { success: true, updatedStock: product?.stock ?? 0 };
  }
}
