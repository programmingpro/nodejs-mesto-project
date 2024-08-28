import statusCodes from './statusCodes';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string | undefined) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCodes.BadRequest
            || statusCodes.NotFound
            || statusCodes.Default;
  }
}

export default CustomError;
