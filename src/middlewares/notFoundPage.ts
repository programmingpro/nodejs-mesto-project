import { NotFoundError } from '../errors';

const notFoundPage = () => {
  throw new NotFoundError('Страница не найдена');
};

export default notFoundPage;
