import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import {
   AuthorizeError,
   NotFoundError,
   ValidationError,
} from './errors';
import { logger } from '../logger';

export const HandleErrorWithLogger: ErrorRequestHandler = (
   error,
   req,
   res,
   next,
) => {
   let reportError = true;
   let status = 500;
   let data = { error: error.message };

   [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
      if (error instanceof typeOfError) {
         reportError = false;
         status = (error as any).status || 400;
         data = { error: error.message };
      }
   });

   if (reportError) {
      logger.error(error);
   } else {
      logger.warn(error);
   }

   res.status(status).json(data);
   
   return;
};

export const HandleUnCaughtException = async (
   error: Error,
) => {
   
   logger.error(error);
   
   process.exit(1);
};