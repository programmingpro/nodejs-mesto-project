import { Request, Response, NextFunction } from 'express';
import Card, { ICard } from '../models/card.model';
import { NotFoundError, BadRequestError, statusCodes } from '../errors';

class CardController {
  static get(req: Request, res: Response, next: NextFunction) {
    Card.find({})
      .then((data) => res.json({ data }))
      .catch(next);
  }

  static post(req: Request, res: Response, next: NextFunction) {
    // @ts-expect-error
    const owner = req.user._id;
    const { name, link, likes }: Pick<ICard, 'name' | 'link' | 'likes'> = req.body;
    Card.create({
      name, link, owner, likes,
    })
      .then((card) => res.json(card))
      .catch((error) => {
        if (statusCodes.BadRequest === error.statusCode) {
          return next(new BadRequestError('Incorrect Data'));
        }
        return next;
      });
  }

  static likeCard(req: Request, res: Response, next: NextFunction) {
    // @ts-expect-error
    const like = req.user._id;
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: like } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Not found'))
      .then((card) => res.send(card))
      .catch(next);
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    Card.findByIdAndDelete(cardId)
      .orFail(() => new NotFoundError('Not found card with this id'))
      .then((card) => res.send(card))
      .catch(next);
  }

  static dislikeCard(req: Request, res: Response, next: NextFunction) {
    // @ts-expect-error
    const like = req.user._id;
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: like } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
      .then((card) => res.send(card))
      .catch(next);
  }
}

export default CardController;
