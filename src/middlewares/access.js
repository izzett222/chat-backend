import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import db from '../database/models';

config();
class Access {
  static async isloggedIn(req, res, next) {
    try {
      const token = req.headers.authorization?.slice(7);
      if (!token) {
        return res.status(401).json({
          message: 'token not found, please re authenticate',
        });
      }
      const decryptedData = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.User.findOne({ where: { username: decryptedData.username } });
      req.user = {
        username: user.username,
        id: user.id,
      };
      return next();
    } catch (error) {
      if (error.message === 'jwt malformed') {
        return res.status(401).json({
          message: 'invalid token, please re authenticate',
        });
      }
      if (error.message === 'invalid token') {
        return res.status(401).json({
          message: 'invalid token, please re authenticate',
        });
      }
      if (error.message === 'jwt expired') {
        return res.status(401).json({
          message: 'jwt expired, please re authenticate',
        });
      }
      return res.status(500).json({
        message: 'server error',
      });
    }
  }
}
export default Access;
