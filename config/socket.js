const { Server } = require("socket.io");
const ordersSocket = require("../sockets/orders.socket");
const votesSocket = require("../sockets/votes.socket");

module.exports = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  global.io = io;
  global.connectedAgents = {};

  io.on("connection", (socket) => {

      console.log("User connected :", socket.id);

      // existing rooms...
      socket.on("join_client", (clientId) => {
          socket.join(`client_${clientId}`);
      });

      socket.on("join_shop", (shopId) => {
          socket.join(`shop_${shopId}`);
      });

      socket.on("join_shop_agent", (data) => {
          const { shopId, userId, nom, role } = data;
          socket.join(`shop_agents_${shopId}`);

          if (!global.connectedAgents[shopId]) global.connectedAgents[shopId] = [];

          const exists = global.connectedAgents[shopId].find(a => a.userId === userId);
          if (!exists) {
              global.connectedAgents[shopId].push({ userId, nom, role, socketId: socket.id });
          }
      });

      socket.on("join_shop_kitchen", (shopId) => {
          socket.join(`shop_kitchen_${shopId}`);
      });

      /*
      |--------------------------------------------------------------------------
      | NEW CONCOURS ROOMS
      |--------------------------------------------------------------------------
      */
      socket.on("join_concours", (concoursId) => {
          socket.join(`concours_${concoursId}`);
      });

      socket.on("join_admin", () => {
          socket.join("admin_room");
      });

      // MODULES
      ordersSocket(io, socket);
      votesSocket(io, socket);

      socket.on("disconnect", (reason) => {
          console.log("User disconnected :", reason);

          Object.keys(global.connectedAgents).forEach((shopId) => {
              global.connectedAgents[shopId] =
                  global.connectedAgents[shopId].filter(a => a.socketId !== socket.id);
          });
      });
  });

};