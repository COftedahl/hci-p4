const SessionLogSchema = {
  logs: {
    isArray: true, 
    exists: true, 
  }, 
  'logs.*.timestamp': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }, 
  'logs.*.interactionTarget': {
    isString: true, 
    exists: true, 
    notEmpty: true, 
  }
}

export default SessionLogSchema;