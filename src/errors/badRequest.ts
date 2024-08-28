import CustomError from './types';
import statusCodes from './statusCodes';

class BadRequestError extends CustomError {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCodes.BadRequest;
  }
}

export default BadRequestError;
