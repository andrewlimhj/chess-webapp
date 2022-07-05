import { Router } from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import db from '../db/models/index.model.js';
import authMiddleware from '../middlewares/auth.middleware.mjs';
import AuthController from '../controllers/auth.controller.js';

const authController = new AuthController(db);

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

const multerUpload = multer({
  storage: multerS3({
    s3,
    bucket: 'deto-bucket',
    acl: 'public-read',
    metadata: (request, file, callback) => {
      callback(null, { fieldName: file.fieldname });
    },
    key: (request, file, callback) => {
      callback(null, Date.now().toString());
    },
  }),
});

const singleFileUpload = multerUpload.single('photo');

const routePrefix = '';
const router = Router();

/* --------------------------------- sign-up -------------------------------- */
router.get(`${routePrefix}/sign-up`, authMiddleware, authController.getSignUp);

router.post(
  `${routePrefix}/sign-up`,
  authMiddleware,
  singleFileUpload,
  authController.postSignUp
);

/* ---------------------------------- login --------------------------------- */
router.get(`${routePrefix}/login`, authMiddleware, authController.getLogin);
router.post(`${routePrefix}/login`, authMiddleware, authController.postLogin);

/* --------------------------------- logout --------------------------------- */
router.delete(`${routePrefix}/logout`, authMiddleware, authController.logout);

export default router;
