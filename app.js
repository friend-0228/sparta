import express from 'express';
import connectToDatabase from './schemas/index.js';
import user from './routes/user.router.js';

const app = express();
const PORT = 3000;

connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

app.use('/user', [router, user]);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸습니다!');
});
