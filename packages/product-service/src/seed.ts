import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Product } from './products/entities/product.entity';

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_PATH ?? join(__dirname, '../product.sqlite'),
  entities: [Product],
  synchronize: true,
});

const PRODUCTS: Partial<Product>[] = [
  {
    id: uuid(),
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res audio certification.',
    sku: 'ELEC-HDPH-001',
    category: 'Electronics',
    price: 149.99,
    stock: 42,
    imageUrl: 'https://placehold.co/400x300/1565c0/ffffff?text=Headphones',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Mechanical Gaming Keyboard',
    description: 'Tactile mechanical switches, RGB per-key backlight, anti-ghosting, and detachable USB-C cable. Built for serious gamers.',
    sku: 'ELEC-KBRD-001',
    category: 'Electronics',
    price: 89.99,
    stock: 35,
    imageUrl: 'https://placehold.co/400x300/263238/ffffff?text=Keyboard',
    isActive: true,
  },
  {
    id: uuid(),
    name: '4K Smart TV 55"',
    description: '55-inch 4K UHD display with HDR10+, built-in streaming apps, Dolby Atmos sound, and a 120Hz refresh rate panel.',
    sku: 'ELEC-TV55-001',
    category: 'Electronics',
    price: 599.99,
    stock: 15,
    imageUrl: 'https://placehold.co/400x300/37474f/ffffff?text=Smart+TV',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Slim Fit Oxford Shirt',
    description: '100% Egyptian cotton slim-fit Oxford shirt. Wrinkle-resistant and machine washable. Available in multiple colours.',
    sku: 'CLTH-SHRT-001',
    category: 'Clothing',
    price: 49.99,
    stock: 80,
    imageUrl: 'https://placehold.co/400x300/1976d2/ffffff?text=Oxford+Shirt',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Premium Running Shoes',
    description: 'Lightweight mesh upper with responsive foam midsole. Designed for long-distance comfort and breathability.',
    sku: 'FOOT-RUN-001',
    category: 'Footwear',
    price: 89.99,
    stock: 60,
    imageUrl: 'https://placehold.co/400x300/e65100/ffffff?text=Running+Shoes',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Stainless Steel Water Bottle 1L',
    description: 'Double-wall vacuum insulation keeps drinks cold 24 hrs or hot 12 hrs. BPA-free, leak-proof lid, dishwasher safe.',
    sku: 'SPRT-BTL-001',
    category: 'Sports & Outdoors',
    price: 34.99,
    stock: 120,
    imageUrl: 'https://placehold.co/400x300/00695c/ffffff?text=Water+Bottle',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Non-Stick Cookware Set (5-Piece)',
    description: 'Ceramic-coated aluminium pans with stay-cool handles. Includes 20cm, 24cm, 28cm fry pans plus two saucepans.',
    sku: 'HOME-COOK-001',
    category: 'Home & Kitchen',
    price: 79.99,
    stock: 28,
    imageUrl: 'https://placehold.co/400x300/4e342e/ffffff?text=Cookware+Set',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Genuine Leather Bifold Wallet',
    description: 'Full-grain leather wallet with RFID-blocking lining, 8 card slots, 2 bill compartments, and slim minimalist profile.',
    sku: 'ACCS-WLLT-001',
    category: 'Accessories',
    price: 39.99,
    stock: 95,
    imageUrl: 'https://placehold.co/400x300/4a148c/ffffff?text=Leather+Wallet',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Thick Non-Slip Yoga Mat',
    description: '6mm TPE foam mat with alignment lines, double-sided non-slip texture, and carrying strap. Eco-friendly and odour-free.',
    sku: 'SPRT-YOGA-001',
    category: 'Sports & Outdoors',
    price: 49.99,
    stock: 55,
    imageUrl: 'https://placehold.co/400x300/558b2f/ffffff?text=Yoga+Mat',
    isActive: true,
  },
  {
    id: uuid(),
    name: 'Scented Soy Candle Gift Set',
    description: 'Set of 4 hand-poured soy wax candles in vanilla, lavender, sandalwood, and citrus. 40-hour burn time each.',
    sku: 'HOME-CNDL-001',
    category: 'Home & Kitchen',
    price: 29.99,
    stock: 70,
    imageUrl: 'https://placehold.co/400x300/f9a825/333333?text=Candle+Set',
    isActive: true,
  },
];

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(Product);

  const existing = await repo.count();
  if (existing > 0) {
    console.log(`Already has ${existing} products — skipping seed.`);
    await dataSource.destroy();
    return;
  }

  await repo.save(PRODUCTS as Product[]);
  console.log(`Seeded ${PRODUCTS.length} products successfully.`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
