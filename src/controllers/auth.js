import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import db from '../database/models';

config();
class Auth {
  static async signup(req, res) {
    try {
      const { username, password } = req.body;
      const user = await db.User.findOne({
        where: {
          username,
        },
      });
      if (user) {
        return res.status(409).json({
          message: 'user already exists',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const savedUser = await db.User.create({ username, password: hashedPassword });
      const token = jwt.sign({ username, id: savedUser.id.toString() }, process.env.JWT_SECRET, { expiresIn: '30s' });
      return res.status(201).json({
        message: 'user created successful',
        data: {
          username, token, id: savedUser.id.toString(),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await db.User.findOne({
        where: {
          username,
        },
      });
      if (!user) {
        return res.status(422).json({
          message: 'Wrong email or password',
        });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(422).json({
          message: 'Wrong email or password',
        });
      }
      const token = jwt.sign({ username, id: user.id.toString() }, process.env.JWT_SECRET);
      return res.status(201).json({
        message: 'user logged in successful',
        data: {
          username, token, id: user.id.toString(),
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  }
}

export default Auth;
