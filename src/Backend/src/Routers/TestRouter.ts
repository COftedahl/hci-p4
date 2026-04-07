import express from 'express';

const testRouter = express.Router();

testRouter.get("", (req, res) => {
  res.json({ message: "You found the DB Management Backend for Log Wizard!" })
})

export default testRouter;