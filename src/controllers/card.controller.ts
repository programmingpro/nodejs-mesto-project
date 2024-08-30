import { Request, Response, NextFunction } from 'express';
import Card, { ICard } from '../models/card.model';
import {
  NotFoundError, BadRequestError, statusCodes, ForbiddenError, CustomError
} from '../errors';

class CardController {
  static get(req: Request, res: Response, next: NextFunction) {
    Card.find({})
      .then((data) => res.json(data))
      .catch(next);
  }

  static post(req: Request, res: Response, next: NextFunction) {
    const owner = req.body.user._id;
    const { name, link }: Pick<ICard, 'name' | 'link'> = req.body;
    Card.create({
      name, link, owner,
    })
      .then((card) => res.json(card))
      .catch((error) => {
        if (error.statusCode === statusCodes.BadRequest) {
          return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        }
        return next;
      });
  }

  static likeCard(req: Request, res: Response, next: NextFunction) {
    const like = req.body.user._id;
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: like } },
      { new: true },
    )
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
      .then((card) => res.send(card))
      .catch(next);
  }

  static delete(req: Request, res: Response, next: NextFunction) {
    const { cardId } = req.params;
    Card.findByIdAndDelete(cardId)
      .orFail(() => new NotFoundError('Карточка с указанным _id не найдена'))
      .then((card) => {
        if (card.owner.toString() === req.body.user._id) {
          Card.findByIdAndDelete(req.params.cardId)
            .then(() => res.send(card));
        } else {
          next(new ForbiddenError('Вы не можете удалить карточку другого пользователя'));
        }
      })
      .catch(next);
  }

  static dislikeCard(req: Request, res: Response, next: NextFunction) {
    const like = req.body.user._id;
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
