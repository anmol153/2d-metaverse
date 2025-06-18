import express from 'express';
import connectDB from './db/connect.db.js';
import dotenv from 'dotenv';
import { AuthRouter } from './routes/auth.route.js';
import { MessageRoute } from './routes/message.route.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server } from './socket.js';

// const __dirname = path.resolve();
dotenv.config();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    }
));

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/message", MessageRoute);
app.use(errorHandler);

// if(process.env.NODE_ENV==="production"){
//   app.use(express.static(path.join(__dirname,"../Client/dist")));
//   app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname,"../Client","dist","index.html"));
//   })
// }

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error.message}`);
  });