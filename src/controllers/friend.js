import db from '../database/models';

class Friend {
  static async add(req, res) {
    try {
      const { user } = req;
      const sender = await db.User.findOne({ where: { username: user.username } });
      const { friendId } = req.query;
      const friend = await db.User.findOne({ where: { id: friendId } });
      if (!friend) {
        return res.status(404).json({
          message: 'friend not found',
        });
      }
      await db.Friend.create({
        sender: sender.id,
        receiver: friend.id,
        status: 'pending',
      });
      return res.status(201).json({ message: 'user added successfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  }

  static async respond(req, res) {
    try {
      const { user } = req;
      const { io } = req;
      const receiver = await db.User.findOne({ where: { username: user.username } });
      const { response } = req.body;
      const { requestId } = req.query;
      const friendRequest = await db.Friend
        .findOne({ where: { id: parseInt(requestId, 10), receiver: receiver.id.toString(), status: 'pending' } });
      if (!friendRequest) return res.status(404).json({ message: 'friend request not found' });
      await friendRequest.update({ status: response });
      if (response === 'approved') {
        const sender = await db.User.findOne({ where: { id: friendRequest.sender } });
        io.emit('FRIEND_ADDED', {
          userId: sender.id,
          username: sender.username,
          message: [],
        });
      }
      return res.status(201).json({ message: `friend request status changed successfully to ${response}` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'server error',
      });
    }
  }

  static async getPendingRequests(req, res) {
    try {
      const { user } = req;
      const userInfo = await db.User.findOne({ where: { username: user.username } });
      const requests = await db.Friend.findAll({ where: { receiver: userInfo.id.toString() } });
      return res.status(200).json({
        message: requests ? 'requests found' : 'no request found',
        data: requests,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'server error',
      });
    }
  }
}

export default Friend;
