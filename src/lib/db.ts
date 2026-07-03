import fs from 'fs';
import path from 'path';

// Define TS Interfaces for models
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  category: string;
  isPopular?: boolean;
  inventory: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  whatsapp: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI';
  paymentStatus: 'Pending' | 'Completed';
  orderStatus: 'Received' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
  // Custom Cake Fields
  isCustomCake?: boolean;
  cakeFlavor?: string;
  weight?: number; // in kg
  theme?: string;
  occasion?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  deliveryAddress?: string;
  referenceImage?: string;
  instructions?: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  photo: string;
  rating: number;
  review: string;
  date: string;
}

// Initial Seeding Data
const initialProducts: Product[] = [
  // Signature Cakes
  {
    id: "sig-1",
    name: "Special Bantwal Rava Cake",
    price: 320,
    rating: 5.0,
    description: "Our signature dish. Soft, golden baked cake made with high-quality semolina (rava), pure ghee, cardamoms, and sliced almonds.",
    image: "/images/crop_rava.jpg",
    category: "Signature Cakes",
    isPopular: true,
    inventory: 20
  },
  {
    id: "sig-2",
    name: "Luxury Rich Fruit Plum Cake",
    price: 450,
    rating: 5.0,
    description: "Our signature dark plum cake loaded with rum-soaked raisins, glacé cherries, citrus peels, and aromatic spices.",
    image: "/images/crop_plum.jpg",
    category: "Signature Cakes",
    isPopular: true,
    inventory: 20
  },
  {
    id: "sig-3",
    name: "Traditional Iyengar Honey Cake",
    price: 45,
    rating: 4.9,
    description: "Moist yellow sponge soaked in pure honey syrup, spread with premium mixed fruit jam, and coated with desiccated coconut.",
    image: "/images/a3.jpg",
    category: "Signature Cakes",
    isPopular: true,
    inventory: 50
  },
  {
    id: "sig-4",
    name: "Signature Baked Dil Pasand",
    price: 60,
    rating: 4.8,
    description: "Crispy sweet pastry envelope stuffed with sweet tutti-frutti, freshly grated coconut, cardamom, and raisins.",
    image: "/images/a3.jpg",
    category: "Signature Cakes",
    inventory: 40
  },
  
  // Celebration Cakes
  {
    id: "bday-1",
    name: "Golden Choco-Truffle Luxury Cake",
    price: 850,
    rating: 4.9,
    description: "Rich dark chocolate ganache layered between moist cocoa sponge, adorned with edible gold leaf flakes.",
    image: "/images/entry1.jpg",
    category: "Celebration Cakes",
    isPopular: true,
    inventory: 15
  },
  {
    id: "wed-1",
    name: "Three-Tier Royal Vanilla Gold Cake",
    price: 4500,
    rating: 5.0,
    description: "A showstopping 3-tiered wedding cake finished with luxury gold detailing and premium fresh vanilla cream frosting.",
    image: "/images/entry3.jpg",
    category: "Celebration Cakes",
    inventory: 5
  },
  {
    id: "cust-1",
    name: "Kids Cartoon Theme Fondant Cake",
    price: 1200,
    rating: 4.9,
    description: "Delightful custom fondant-decorated cakes crafted according to your child's favorite characters.",
    image: "/images/entry2.jpg",
    category: "Celebration Cakes",
    inventory: 8
  },

  // Puffs & Savories
  {
    id: "puff-1",
    name: "Traditional Spicy Veg Puff",
    price: 25,
    rating: 4.9,
    description: "Ultra-flaky golden puff pastry stuffed with a perfectly spiced, traditional potato and green pea filling.",
    image: "/images/crop_puff2.jpg",
    category: "Puffs & Savories",
    isPopular: true,
    inventory: 100
  },
  {
    id: "puff-2",
    name: "Golden Spicy Egg Puff",
    price: 30,
    rating: 4.8,
    description: "Crisp puff pastry enclosing a perfectly boiled egg half spiced with caramelized onion masala.",
    image: "/images/crop_puff1.jpg",
    category: "Puffs & Savories",
    isPopular: true,
    inventory: 80
  },
  {
    id: "roll-1",
    name: "Grilled Paneer Tikka Roll",
    price: 75,
    rating: 4.7,
    description: "Spiced paneer cubes cooked in tandoori spices, rolled in a soft paratha wrap with mint chutney.",
    image: "/images/crop_paneer1.jpg",
    category: "Puffs & Savories",
    inventory: 40
  },
  {
    id: "sam-1",
    name: "Crisp Punjabi Aloo Samosa",
    price: 15,
    rating: 4.9,
    description: "Crispy, golden triangular pastry stuffed with spiced potato and green peas mash. Served with sweet dates chutney.",
    image: "/images/crop_samosa1.jpg",
    category: "Puffs & Savories",
    inventory: 120
  },
  {
    id: "chip-1",
    name: "Kerala Banana Chips (Salted)",
    price: 60,
    rating: 4.8,
    description: "Crisp, thin banana slices fried in pure coconut oil and lightly salted. Made in-store. (200g pack)",
    image: "/images/a2.jpg",
    category: "Puffs & Savories",
    inventory: 50
  },
  {
    id: "chip-2",
    name: "Spiced Potato Wafers / Chips",
    price: 50,
    rating: 4.6,
    description: "Extra crunchy hand-cut potato chips dusted with local spicy red chilli and salt mix. (150g pack)",
    image: "/images/a2.jpg",
    category: "Puffs & Savories",
    inventory: 60
  },

  // Buns & Sandwiches
  {
    id: "kbun-1",
    name: "Iyengar Special Khara Bun",
    price: 20,
    rating: 4.9,
    description: "Soft, golden baked buns spiced with fresh green chillies, coriander leaves, onions, and curry leaves. A local favorite!",
    image: "/images/a4.jpg",
    category: "Buns & Sandwiches",
    isPopular: true,
    inventory: 80
  },
  {
    id: "ebun-1",
    name: "Spiced Egg Masala Bun",
    price: 35,
    rating: 4.7,
    description: "Soft bun stuffed with a savory boiled egg half and zesty Southern onion-chilli spice paste.",
    image: "/images/savory2.jpg",
    category: "Buns & Sandwiches",
    inventory: 40
  },
  {
    id: "burg-1",
    name: "Crunchy Aloo Veg Burger",
    price: 80,
    rating: 4.6,
    description: "Crispy vegetable patty served inside soft toasted buns with cheese slices, fresh tomatoes, and spicy mayo.",
    image: "/images/a4.jpg",
    category: "Buns & Sandwiches",
    inventory: 30
  },
  {
    id: "sand-1",
    name: "Grilled Spiced Veg Sandwich",
    price: 65,
    rating: 4.5,
    description: "Toasted slices of fresh bread loaded with spiced vegetables, green chutney, and melting mozzarella cheese.",
    image: "/images/a4.jpg",
    category: "Buns & Sandwiches",
    inventory: 35
  },

  // Desserts & Ice Cream
  {
    id: "ice-1",
    name: "Royal Rajbhog Ice Cream",
    price: 80,
    rating: 4.9,
    description: "Creamy rich ice cream infused with saffron, cardamoms, almonds, pistachios, and real cashew bits.",
    image: "/images/a4.jpg",
    category: "Desserts & Ice Cream",
    isPopular: true,
    inventory: 50
  },
  {
    id: "ice-2",
    name: "Signature Honey-Almond Scoop",
    price: 70,
    rating: 4.8,
    description: "Premium vanilla cream base layered with pure local honey swirl and toasted almond chunks.",
    image: "/images/a4.jpg",
    category: "Desserts & Ice Cream",
    inventory: 60
  },
  {
    id: "past-1",
    name: "Red Velvet Cream Cheese Pastry",
    price: 90,
    rating: 4.7,
    description: "Mouth-melting slice of red velvet sponge layered with smooth premium cream cheese frosting.",
    image: "/images/a3.jpg",
    category: "Desserts & Ice Cream",
    isPopular: true,
    inventory: 25
  },
  {
    id: "don-1",
    name: "Glazed Belgian Chocolate Donut",
    price: 70,
    rating: 4.7,
    description: "Freshly fried ring donut glazed with premium dark Belgian chocolate and decorative sprinkles.",
    image: "/images/a3.jpg",
    category: "Desserts & Ice Cream",
    inventory: 15
  },

  // Fresh Breads & Cookies
  {
    id: "bread-1",
    name: "Premium Milk Sandwich Bread",
    price: 45,
    rating: 4.7,
    description: "Extra soft, fresh milk bread baked daily. Free from artificial preservatives.",
    image: "/images/a1.jpg",
    category: "Fresh Breads & Cookies",
    inventory: 60
  },
  {
    id: "cook-1",
    name: "Pure Butter Cashew Cookies",
    price: 150,
    rating: 4.8,
    description: "Melts in your mouth cookies baked with rich pure butter and topped with premium Bantwal cashew nuts. (250g pack)",
    image: "/images/a4.jpg",
    category: "Fresh Breads & Cookies",
    inventory: 35
  },
  {
    id: "bisc-1",
    name: "Crisp Salted Jeera Biscuits",
    price: 80,
    rating: 4.7,
    description: "Crispy and savory biscuits flavored with roasted cumin seeds. Perfect companion for hot evening tea.",
    image: "/images/a1.jpg",
    category: "Fresh Breads & Cookies",
    inventory: 50
  },

  // Beverages
  {
    id: "bev-1",
    name: "Signature Cardamom Tea (Chai)",
    price: 15,
    rating: 4.9,
    description: "Freshly brewed hot milk tea infused with aromatic organic cardamoms.",
    image: "/images/a4.jpg",
    category: "Beverages",
    isPopular: true,
    inventory: 200
  },
  {
    id: "bev-2",
    name: "Traditional South Indian Filter Coffee",
    price: 20,
    rating: 4.9,
    description: "Strong decoction of premium chicory coffee blended with thick frothed milk.",
    image: "/images/a4.jpg",
    category: "Beverages",
    inventory: 200
  }
];

// Initial reviews
const initialReviews: CustomerReview[] = [
  {
    id: "rev-1",
    name: "B l Eshwarappa",
    photo: "/images/eshwarappa.jpg",
    rating: 5,
    review: "I have been coming to Vijay Iyyangar Bakery since my youth. Their signature Rava Cake is legendary in Bantwal—always rich, soft, and delicious. Outstanding traditional quality!",
    date: "2026-06-25"
  },
  {
    id: "rev-2",
    name: "Sahana",
    photo: "/images/sahana.jpg",
    rating: 5,
    review: "The custom birthday cakes are incredibly beautiful! I ordered a multi-tier chocolate cake and the details were perfect. Tastes very premium and light.",
    date: "2026-06-28"
  },
  {
    id: "rev-3",
    name: "Roppa",
    photo: "/images/roppa.jpg",
    rating: 5,
    review: "Our family celebrations are incomplete without Vijay Iyyangar's sweet Dil Pasand and hot Veg Puffs. Exceptional service, high hygiene standards, and very clean!",
    date: "2026-06-29"
  },
  {
    id: "rev-4",
    name: "Sunil Shetty",
    photo: "/images/sunilshetty.jpg",
    rating: 5,
    review: "Awesome filter coffee and Egg Buns! It's our go-to evening snack joint in BC Road Bypass. Very affordable and fast ordering.",
    date: "2026-06-30"
  }
];

// File-based Database Helper
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// LowDB-like class to handle file operations safely
class JSONDatabase {
  private data: {
    products: Product[];
    orders: Order[];
    reviews: CustomerReview[];
  };

  constructor() {
    this.data = { products: [], orders: [], reviews: [] };
    this.read();
  }

  private read() {
    try {
      ensureDirectoryExistence(DB_FILE_PATH);
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        // First time initialization
        this.data = {
          products: initialProducts,
          orders: [],
          reviews: initialReviews
        };
        this.write();
      }
    } catch (error) {
      console.error('Error reading JSON DB, initializing empty:', error);
      this.data = {
        products: initialProducts,
        orders: [],
        reviews: initialReviews
      };
    }
  }

  private write() {
    try {
      ensureDirectoryExistence(DB_FILE_PATH);
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to JSON DB:', error);
    }
  }

  // API operations
  getProducts(): Product[] {
    this.read();
    return this.data.products;
  }

  getProductById(id: string): Product | undefined {
    this.read();
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    this.read();
    const newProduct = {
      ...product,
      id: 'prod-' + Date.now().toString(36)
    };
    this.data.products.push(newProduct);
    this.write();
    return newProduct;
  }

  updateProduct(id: string, updatedFields: Partial<Product>): Product | null {
    this.read();
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.data.products[index] = {
      ...this.data.products[index],
      ...updatedFields
    };
    this.write();
    return this.data.products[index];
  }

  deleteProduct(id: string): boolean {
    this.read();
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.write();
    return true;
  }

  getOrders(): Order[] {
    this.read();
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    this.read();
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'orderStatus' | 'paymentStatus'>): Order {
    this.read();
    const newOrder: Order = {
      ...order,
      id: 'VIB-' + Math.floor(100000 + Math.random() * 900000), // Nice order number
      createdAt: new Date().toISOString(),
      orderStatus: 'Received',
      paymentStatus: order.paymentMethod === 'UPI' ? 'Completed' : 'Pending'
    };
    
    // Update product inventory
    order.items.forEach(item => {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.inventory = Math.max(0, prod.inventory - item.quantity);
      }
    });

    this.data.orders.push(newOrder);
    this.write();
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['orderStatus']): Order | null {
    this.read();
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.data.orders[index].orderStatus = status;
    this.write();
    return this.data.orders[index];
  }

  updateOrderPaymentStatus(id: string, status: Order['paymentStatus']): Order | null {
    this.read();
    const index = this.data.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.data.orders[index].paymentStatus = status;
    this.write();
    return this.data.orders[index];
  }

  getReviews(): CustomerReview[] {
    this.read();
    return this.data.reviews;
  }
}

// Export database client instance
export const db = new JSONDatabase();
