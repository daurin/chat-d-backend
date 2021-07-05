import express from 'express';
let router = express.Router();

import postUser from '../controllers/post_user';

router.post('/users', postUser);

export default router;