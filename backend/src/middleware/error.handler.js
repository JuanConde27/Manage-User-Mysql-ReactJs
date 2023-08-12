import { ValidationError } from 'sequelize';

export default (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json(err);
  }

  return res.status(500).json(err);
}

