import express from 'express';
import { indexPage } from '../controllers'; // , addMessage
// import { modifyMessage, performAsyncAction } from '../middleware';

const indexRouter = express.Router();
indexRouter.get('/', indexPage);
// indexRouter.get('/messages', messagesPage);
// indexRouter.post('/messages', modifyMessage, performAsyncAction, addMessage);

export { indexRouter };
