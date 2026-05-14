import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/multer.js';
import { CreateUserController } from './controllers/user/CreateUserController.js'
import { validateSchema } from './middlewares/validateSchema.js';
import { authSchema, createUserSchema } from './schemas/userSchemas.js'
import { AuthController } from './controllers/user/AuthUserController.js'
import { DetailUserController } from './controllers/user/DetailUserController.js';
import { isAdmin } from './middlewares/isAdmin.js';
import { isAuthenticated } from './middlewares/isAuthenticated.js';
import { CreateCategoryController } from './controllers/category/CreateCategoryController.js';
import { createCategorySchema } from './schemas/categorySchema.js'
import { ListCategoryController } from './controllers/category/ListCategoryController.js';
import { CreateProductController } from './controllers/Product/CreateProductController.js';
import { ListProductByCategoryController } from './controllers/Product/ListProductByCategoryController.js';
import { createProductSchema, listProductSchema, listProductByCategorySchema } from './schemas/productSchema.js';
import { ListProductController } from './controllers/Product/ListProductController.js';
import { DeleteProductController } from './controllers/Product/DeleteProductController.js';
import { CreateOrderController } from './controllers/Order/CreateOrderController.js';
import { addItemOrderSchema, createOrderSchema } from './schemas/orderSchema.js';
import { ListOrderController } from './controllers/Order/ListOrderController.js';
import { AddItemOrderController } from './controllers/Order/AddItemOrderController.js';

const router = Router();

const upload = multer(uploadConfig);

// Rotas Users
router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle);

router.post("/session", validateSchema(authSchema), new AuthController().handle);

router.get("/me", isAuthenticated, new DetailUserController().handle);

// Rotas Category
router.post("/category", isAuthenticated, isAdmin, validateSchema(createCategorySchema), new CreateCategoryController().handle);

router.get("/category", isAuthenticated, new ListCategoryController().handle);

// Rotas Product
router.post("/product", isAuthenticated, isAdmin, upload.single('file'), validateSchema(createProductSchema), new CreateProductController().handle);

router.get("/products", isAuthenticated, validateSchema(listProductSchema), new ListProductController().handle);

router.get("/category/product/", isAuthenticated, validateSchema(listProductByCategorySchema), new ListProductByCategoryController().handle);

router.delete("/product", isAuthenticated, isAdmin, new DeleteProductController().handle);

// Rotas Order

router.post("/order", isAuthenticated, validateSchema(createOrderSchema), new CreateOrderController().handle);

router.get("/orders", isAuthenticated, new ListOrderController().handle);

// Adicionar item a order

router.post("/order/add", isAuthenticated, validateSchema(addItemOrderSchema), new AddItemOrderController().handle);

export { router }