export function attachSocketUser(socket, next) {
  const userId = socket.handshake?.auth?.userId;
  if (userId) {
    socket.user = { id: userId };
  }
  next();
}
