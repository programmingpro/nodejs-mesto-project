import CustomError from './types';
import statusCodes from './statusCodes';

class NotFoundError extends CustomError {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCodes.NotFound;
  }
}

export default NotFoundError;
