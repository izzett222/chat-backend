import { Op } from 'sequelize';
import db from '../database/models';

class User {
  static async getUser(req, res) {
    try {
      const { username } = req.query;
      const { user } = req;
      const loggedInUser = await db.User.findOne({ where: { username: user.username } });
      const searchedUserInfo = await db.User.findOne({ where: { username } });
      if (!searchedUserInfo) return res.status(404).json({ message: 'user not found' });
      if (searchedUserInfo.username === user.username) return res.status(404).json({ message: 'user not found' });
      const friendRequest = await db.Friend.findOne({
        where: {
          receiver: {
            [Op.or]: [loggedInUser.id.toString(), searchedUserInfo.id.toString()],
          },
          sender: {
            [Op.or]: [loggedInUser.id.toString(), searchedUserInfo.id.toString()],
          },
        },
      });
      if (friendRequest?.status === 'approved') return res.status(404).json({ message: 'user not found' });
      return res.status(200).json({
        message: 'user found successfully',
        data: {
          userId: searchedUserInfo.id,
          username: searchedUserInfo.username,
          friendRequest,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  }
}
export default User;
