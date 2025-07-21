# 🧠 Core Development Concepts & Patterns

## 📋 Table of Contents
1. [Frontend Concepts](#frontend-concepts)
2. [Backend Concepts](#backend-concepts)
3. [Database Concepts](#database-concepts)
4. [DevOps & Deployment](#devops--deployment)
5. [Design Patterns](#design-patterns)
6. [Security Concepts](#security-concepts)

---

## 🎨 Frontend Concepts

### **React Ecosystem**

#### **1. Functional Components with Hooks**
```typescript
// useState Hook - Local state management
const [products, setProducts] = useState<Product[]>([]);

// useEffect Hook - Side effects and lifecycle
useEffect(() => {
  fetchProducts();
}, []); // Dependency array for optimization

// useContext Hook - Global state access
const { user, isAuthenticated } = useAuth();
```

#### **2. Context API Pattern**
```typescript
// Provider Pattern - Centralized state
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    // Authentication logic
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Consumer Pattern - Accessing context
const { user, login } = useContext(AuthContext);
```

#### **3. Custom Hooks Pattern**
```typescript
// Reusable logic extraction
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in components
const { user, isAuthenticated, login, logout } = useAuth();
```

#### **4. Controlled Components**
```typescript
// Form state management
const [formData, setFormData] = useState({
  title: '',
  price: '',
  description: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

// Two-way data binding
<input 
  name="title"
  value={formData.title}
  onChange={handleChange}
/>
```

#### **5. TypeScript Integration**
```typescript
// Interface definitions
interface Product {
  id: string;
  title: string;
  price?: number;
  images: string[];
}

// Props typing
interface ProductCardProps {
  product: Product;
  onBid: (amount: number) => void;
}

// Component with typed props
const ProductCard: React.FC<ProductCardProps> = ({ product, onBid }) => {
  return <div>{product.title}</div>;
};
```

### **Routing Concepts**

#### **Client-Side Routing**
```typescript
// React Router DOM - SPA navigation
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/products/:id" element={<ProductDetail />} />
  <Route path="/create" element={<PrivateRoute><CreateListing /></PrivateRoute>} />
</Routes>

// Programmatic navigation
const navigate = useNavigate();
navigate('/products');

// URL parameters
const { id } = useParams<{ id: string }>();
```

#### **Protected Routes Pattern**
```typescript
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
```

### **State Management Patterns**

#### **Lifting State Up**
```typescript
// Parent component manages shared state
const App = () => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Header />
      <Routes />
    </AuthContext.Provider>
  );
};
```

#### **Derived State**
```typescript
// Compute values from existing state
const [products, setProducts] = useState<Product[]>([]);
const [searchQuery, setSearchQuery] = useState('');

// Derived state - no separate state needed
const filteredProducts = useMemo(() => {
  return products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [products, searchQuery]);
```

---

## ⚙️ Backend Concepts

### **Express.js Framework**

#### **Middleware Pattern**
```javascript
// Application-level middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use('/uploads', express.static('uploads')); // Serve static files

// Route-level middleware
app.use('/api/protected', authMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

#### **Router Module Pattern**
```javascript
// Modular route organization
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', authMiddleware, createProduct);
router.get('/:id', getProductById);

module.exports = router;

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
```

### **RESTful API Design**

#### **HTTP Methods & Status Codes**
```javascript
// GET - Retrieve data
router.get('/products', (req, res) => {
  res.status(200).json({ products });
});

// POST - Create new resource
router.post('/products', (req, res) => {
  // Create logic
  res.status(201).json({ product: newProduct });
});

// PUT - Update existing resource
router.put('/products/:id', (req, res) => {
  // Update logic
  res.status(200).json({ product: updatedProduct });
});

// DELETE - Remove resource
router.delete('/products/:id', (req, res) => {
  // Delete logic
  res.status(204).send();
});
```

#### **Request/Response Patterns**
```javascript
// Consistent API response format
const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Error response format
const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};
```

### **Authentication Patterns**

#### **JWT (JSON Web Tokens)**
```javascript
// Token generation
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Token verification middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### **Password Hashing**
```javascript
const bcrypt = require('bcryptjs');

// Hash password before saving
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
```

---

## 🗄️ Database Concepts

### **MongoDB & Mongoose ODM**

#### **Schema Definition**
```javascript
const mongoose = require('mongoose');

// Schema with validation
const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: ['Electronics', 'Apparel', 'Books', 'Other'],
    required: true
  }
}, {
  timestamps: true // Automatically add createdAt, updatedAt
});

// Model creation
const Product = mongoose.model('Product', ProductSchema);
```

#### **Document Relationships**

```javascript
// Embedded Documents (One-to-Many)
const ProductSchema = new mongoose.Schema({
  title: String,
  bids: [{
    amount: Number,
    bidderId: mongoose.Schema.Types.ObjectId,
    bidderName: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

// Referenced Documents (Many-to-Many)
const UserSchema = new mongoose.Schema({
  username: String,
  favoriteProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
});

// Population (JOIN equivalent)
const user = await User.findById(userId).populate('favoriteProducts');
```

#### **Query Patterns**
```javascript
// Basic queries
const products = await Product.find({ status: 'active' });
const product = await Product.findById(productId);

// Complex queries with conditions
const products = await Product.find({
  category: 'Electronics',
  price: { $gte: 1000, $lte: 50000 },
  status: 'active'
}).sort({ createdAt: -1 }).limit(10);

// Text search
const products = await Product.find({
  $text: { $search: searchQuery }
});

// Aggregation pipeline
const stats = await Product.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

### **Connection Management**
```javascript
// Connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Connection pooling
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
```

---

## 🚀 DevOps & Deployment

### **Serverless Architecture**

#### **Vercel Functions**
```javascript
// Serverless function structure
// /api/hello.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello World' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Express app as serverless function
// /api/index.js
const app = require('./app');
module.exports = app;
```

#### **Environment Configuration**
```json
// vercel.json - Deployment configuration
{
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.domain.com"
    }
  }
}
```

### **Build & Deployment Process**

#### **Frontend Build Pipeline**
```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "vite build"
  }
}
```

#### **Static Site Generation**
```javascript
// Vite configuration for production
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

---

## 🎯 Design Patterns

### **1. Provider Pattern**
```typescript
// Context provider for global state
const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
  }, []);

  const value = useMemo(() => ({
    products,
    addProduct
  }), [products, addProduct]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
```

### **2. Higher-Order Component (HOC)**
```typescript
// Authentication HOC
const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <Component {...props} />;
  };
};

// Usage
const ProtectedComponent = withAuth(MyComponent);
```

### **3. Repository Pattern**
```javascript
// Data access abstraction
class ProductRepository {
  async findAll() {
    return Product.find({ status: 'active' });
  }
  
  async findById(id) {
    return Product.findById(id);
  }
  
  async create(productData) {
    const product = new Product(productData);
    return product.save();
  }
  
  async update(id, updateData) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async delete(id) {
    return Product.findByIdAndDelete(id);
  }
}

// Service layer using repository
class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
  }
  
  async getAllProducts() {
    return this.productRepo.findAll();
  }
  
  async createProduct(productData) {
    // Business logic validation
    if (!productData.title) {
      throw new Error('Title is required');
    }
    
    return this.productRepo.create(productData);
  }
}
```

### **4. Factory Pattern**
```javascript
// API response factory
class ResponseFactory {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }
  
  static error(message, statusCode = 500) {
    return {
      success: false,
      error: message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }
}

// Usage in controllers
res.json(ResponseFactory.success(products, 'Products fetched successfully'));
```

---

## 🔐 Security Concepts

### **Input Validation & Sanitization**
```javascript
const validator = require('validator');

// Input validation middleware
const validateProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  
  // Validation rules
  if (!title || !validator.isLength(title, { min: 1, max: 100 })) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  
  if (price && !validator.isNumeric(price.toString())) {
    return res.status(400).json({ error: 'Invalid price' });
  }
  
  // Sanitization
  req.body.title = validator.escape(title);
  req.body.description = validator.escape(description);
  
  next();
};
```

### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', apiLimiter);

// Stricter limits for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  skipSuccessfulRequests: true
});

app.use('/api/auth/login', authLimiter);
```

### **CORS Security**
```javascript
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://yourdomain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 📊 Performance Concepts

### **Memoization**
```typescript
// React.memo - Component memoization
const ProductCard = React.memo<ProductCardProps>(({ product, onBid }) => {
  return <div>{product.title}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.product.id === nextProps.product.id;
});

// useMemo - Value memoization
const expensiveValue = useMemo(() => {
  return products.filter(p => p.price > 1000);
}, [products]);

// useCallback - Function memoization
const handleBid = useCallback((amount: number) => {
  // Bid logic
}, [productId]);
```

### **Lazy Loading**
```typescript
// Route-based code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Suspense wrapper
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductDetail />} />
  </Routes>
</Suspense>
```

### **Database Optimization**
```javascript
// Indexing for faster queries
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ createdAt: -1 });

// Aggregation for complex queries
const popularProducts = await Product.aggregate([
  { $match: { status: 'active' } },
  { $addFields: { bidCount: { $size: '$bids' } } },
  { $sort: { bidCount: -1 } },
  { $limit: 10 }
]);
```

This comprehensive guide covers all the major concepts, patterns, and technologies used in building your e-commerce bidding platform! 🚀
