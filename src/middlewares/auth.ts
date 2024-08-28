import { Request, Response, NextFunction } from 'express';

const authMe = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = {
    _id: '669c053f486f489eb7eabb47',
  };
  next();
};

export default authMe;
