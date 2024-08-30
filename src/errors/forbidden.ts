import statusCodes from './statusCodes';
import CustomError from './types';

class ForbiddenError extends CustomError {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.Forbidden;
  }
}

export default ForbiddenError;
