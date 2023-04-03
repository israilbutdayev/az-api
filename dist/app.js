import express from 'express';
import dotenv from 'dotenv';
import router from './routers/list.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use('/list', router);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
