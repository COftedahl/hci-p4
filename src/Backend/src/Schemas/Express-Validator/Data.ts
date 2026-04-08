import { escape } from "node:querystring";

const SessionLogSchema = {
  logs: {
    isArray: true, 
    exists: true, 
  }, 
  'logs.*.timestamp': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
    escape: true, 
  }, 
  'logs.*.interactionTarget': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
    escape: true, 
  }
}

export default SessionLogSchema;