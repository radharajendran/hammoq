const send = (req, res, responseData) =>{

    if (responseData && ['error', 'RequestError'].indexOf(responseData.name) > -1) {
      return sendError(req, res, responseData);
    }
  
    /// Handled Error
    if (responseData && responseData instanceof Error) {
      responseData.status = 'HANDLED_EXCEPTION';
      return sendError(req, res, responseData);
    }
  
    try {
      return res.send(responseData);
    } catch (err) {
      return res.send(err);
    }
  }
  
  const sendError = (req, res, err, meta) => {
    try {
      console.error('Error', err);
  
      meta = meta || {
        errorCode: err.code || '',
        errorDesc: err.message
      };
  
      const stack = new Error().stack;
      const callstack = stack.toString();
  
      res.status(500).send({
        err,
        callstack,
        errorCode: meta.errorCode || '',
        errorDesc: meta.errorDesc || '',
        userData: meta
      });
    } catch (err) {
      logger.error('When sending error response', err);
    }
  }
  
module.exports = {
    send,
    sendError
}