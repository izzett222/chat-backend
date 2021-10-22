/* eslint-disable no-restricted-syntax */
import express from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import http from 'http';
import { config } from 'dotenv';
import cors from 'cors';
import routes from './routes';
import db from './database/models';

config();
const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3006;
const server = http.createServer(app);
// const server = app.listen(port, () => process.stdout.write(`Server is running on http://localhost:${port}/api`));

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.use(async (socket, next) => {
  try {
    const { token } = socket.handshake.auth;
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findOne({ where: { username } });
    socket.userId = user.id;
    socket.username = user.username;
    return next();
  } catch (error) {
    return next(new Error('invalid token'));
  }
});
io.on('connection', async (socket) => {
  socket.join(socket.userId.toString());
  const users = [];
  const friends = await db.Friend.findAll({
    where: {
      [Op.or]: {
        receiver: socket.userId.toString(),
        sender: socket.userId.toString(),
      },
      status: 'approved',
    },
  });
  await friends.reduce(async (promise, friend) => {
    await promise;
    const otherUser = await db.User.findOne({
      where: { id: socket.userId.toString() === friend.receiver ? friend.sender : friend.receiver },
    });
    const message = await db.Message.findAll({
      where: {
        sender: {
          [Op.or]: [friend.sender.toString(), friend.receiver.toString()],
        },
        receiver: {
          [Op.or]: [friend.sender.toString(), friend.receiver.toString()],
        },
      },
      order: [['createdAt', 'ASC']],
    });
    const result = {
      userId: otherUser.id,
      username: otherUser.username,
      message,
    };
    users.push(result);
  }, Promise.resolve());
  const pendingRequest = await db.Friend.findAll({
    where: {
      receiver: socket.userId.toString(),
      status: 'pending',
    },
  });
  const requestersId = pendingRequest.map((request) => request.sender);
  const requestSenders = await db.User.findAll({
    where: {
      id: {
        [Op.or]: requestersId,
      },
    },
  });
  const request = pendingRequest.map((req) => ({
    requestId: req.id,
    username: requestSenders.find((el) => el.id === Number(req.sender)).username,
  }));
  socket.emit('users', users);
  socket.emit('pending_request', request);
  socket.on('private message', async ({ content, to }) => {
    const message = {
      message: content,
      sender: socket.userId.toString(),
      receiver: to.toString(),
    };
    const savedMessage = await db.Message.create(message);
    io.sockets.to(to.toString()).to(socket.userId.toString()).emit('private message', savedMessage);
  });
});
app.get('/', async (req, res) => res.send('welcome to chat backend'));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api', routes);

server.listen(port, () => process.stdout.write(`Server is running on http://localhost:${port}/api`));
