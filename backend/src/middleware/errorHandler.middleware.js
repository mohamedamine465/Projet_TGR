import { sendError } from '#shared/utils/responseHandler.js';
import { AppError } from '#shared/utils/customErrors.js';

export const globalErrorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);
  
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.data);
  }
  
  // Default to 500 server error
  return sendError(res, 500, "Erreur interne du serveur", err.message);
};
