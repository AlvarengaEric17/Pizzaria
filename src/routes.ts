import { Router, Request, Response } from 'express';
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
router.post("/product", isAuthenticated, isAdmin, upload.single('file'), new CreateProductController().handle);

export { router }