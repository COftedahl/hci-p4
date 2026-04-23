import testRouter from "./Routers/TestRouter";
import dbRouter from "./Routers/DBRouter";
import express from 'express';
import dns from 'node:dns/promises';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors'; 

const appRouter = express(); 
const PORT = 5000;
appRouter.use(express.json());
appRouter.use(cors({origin: "*",}));
dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

mongoose
  .connect(process.env.DB_CONNECT_STRING ?? "", { dbName: process.env.DB_NAME })
  // .connect(process.env.DB_CONNECT_STRING ?? "")
  .catch((e) => {
    console.log("Failed to connect to DB: connection string = ", process.env.DB_CONNECT_STRING, " connecting to DB ", process.env.DB_NAME);
    console.error(e);
  })
  .then(() => {
    console.log("Connected to database!");
    appRouter.use("/", testRouter);
    appRouter.use("/db/", dbRouter);
    appRouter.listen(PORT, () => {console.log("App listening at port " + PORT)});
  });



export default appRouter;
