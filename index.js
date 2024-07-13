import express from 'express';
import { databaseConnection } from './utils/database.js';
import cookieParser from 'cookie-parser';
import SignUpRoute from './routes/SignUpRoute.js';

import cors from 'cors'; 

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials:true,
};


app.use(cors(corsOptions));




app.use("/api/v1/user", SignUpRoute);


const port = process.env.PORT || 3000;

databaseConnection();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
