const socketIo = require('socket.io');
const MessageDAO = require('../repository/message.dao');

function setupSocket(server) {
  const io = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('Un utilisateur connecté');
    
    socket.on('joinGroup', (groupe_id) => {
      socket.join(groupe_id);
    });

    socket.on('sendMessage', async (data) => {
      const message = await MessageDAO.createMessage(data);
      io.to(data.groupe_id || data.receiver_id).emit('newMessage', message);
    });
  });
}

module.exports = setupSocket;