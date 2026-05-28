import express from 'express';
import { subscribeNewsletter } from './newsletter.controller.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);

export default router;
