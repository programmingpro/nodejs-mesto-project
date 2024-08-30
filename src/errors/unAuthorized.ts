import statusCodes from './statusCodes';
import CustomError from './types';

class UnauthorizedError extends CustomError {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCodes.UnAuthorized;
  }
}

export default UnauthorizedError;
