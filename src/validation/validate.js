import { loginSchema, signupSchema } from './schemas/auth';

class Validate {
  static async loginValidation(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return next();
  }

  static async registerValidation(req, res, next) {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    return next();
  }
}

export default Validate;
