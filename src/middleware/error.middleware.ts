import { Request, Response } from 'express';
import HttpException from '@/utils/exceptions/http.exeption';

/**
 *
 * @param error
 * @param req http request coming in from express
 * @param res the response with the error and status code
 */
function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response
): void {
  const status = error.status || 500;
  const message = error.message || 'something went wrong..';

  res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
