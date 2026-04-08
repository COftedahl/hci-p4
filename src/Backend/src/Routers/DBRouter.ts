import express from 'express';
import SessionLog from '../Schemas/Mongoose/SessionLog';
import SessionLogSchema from '../Schemas/Express-Validator/Data';
import ISessionLog from '../Types/ISessionLog';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { unescape } from 'validator';
import { datetimeFormatter } from '../Utility/formatter';
import ILog from '../Types/ILog';

const dbRouter = express.Router();

/* 
 * endpoint to retrieve all the records from the db
 * @return: json[] of the data retrieved
 */
dbRouter.get("", async (req, res) => {
  const allLogs_Documents: any = await SessionLog.find();
  let allLogs: ISessionLog[] = allLogs_Documents.map((sessionLog: ISessionLog) => {
    return { 
      logs: sessionLog.logs.map((log: ILog) => {
        return { 
          timestamp: unescape(log.timestamp), 
          interactionTarget: unescape(log.interactionTarget) 
        } 
      })
    }
  });
  res.json({response: allLogs}).status(200);
})

/* 
 * endpoint ot save a session log to the db
 * @param data: any
 */
dbRouter.post("/save", async (req, res) => {
  await checkSchema(SessionLogSchema).run(req);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    console.log(error.mapped());
    res.send({ response: "Error in session log argument"}).status(422);
    return;
  }

  //store the data corresponding to the item to delete
  const sessionLog: ISessionLog = matchedData(req); 

  const newLog = new SessionLog({
    //newLog is the document object we want to store
    ...sessionLog,
  });
  newLog
    .save()
    .catch((e) => console.error(e))
    .then(() => console.log("[" + datetimeFormatter.format(Date.now()) + "] " + "Successfully saved log"));
  res.json({ response: "Item Saved" });

})

export default dbRouter;