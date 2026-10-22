const { Server } = require("socket.io");
const ordersSocket = require("../sockets/orders.socket");
const votesSocket = require("../sockets/votes.socket");

module.exports = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
    });

    global.io = io;
    global.connectedAgents = {};

    io.on("connection", (socket) => {

        console.log("User connected :", socket.id);

        /*
        |--------------------------------------------------------------------------
        | CLIENT
        |--------------------------------------------------------------------------
        */
        socket.on("join_client", (clientId) => {
            socket.join(`client_${clientId}`);
        });

        /*
        |--------------------------------------------------------------------------
        | SHOP
        |--------------------------------------------------------------------------
        */
        socket.on("join_shop", (shopId) => {
            socket.join(`shop_${shopId}`);
        });

        /*
        |--------------------------------------------------------------------------
        | SHOP AGENT
        |--------------------------------------------------------------------------
        */
        socket.on("join_shop_agent", (data) => {

            const { shopId, userId, nom, role } = data;

            socket.join(`shop_agents_${shopId}`);

            if (!global.connectedAgents[shopId]) {
                global.connectedAgents[shopId] = [];
            }

            const exists = global.connectedAgents[shopId]
                .find(agent => agent.userId === userId);

            if (!exists) {

                global.connectedAgents[shopId].push({
                    userId,
                    nom,
                    role,
                    socketId: socket.id
                });

            }

        });

        /*
        |--------------------------------------------------------------------------
        | SHOP KITCHEN
        |--------------------------------------------------------------------------
        */
        socket.on("join_shop_kitchen", (shopId) => {
            socket.join(`shop_kitchen_${shopId}`);
        });

        /*
        |--------------------------------------------------------------------------
        | CONCOURS
        |--------------------------------------------------------------------------
        */
        socket.on("join-concours", ({ concours_id }) => {

            socket.join(`concours_${concours_id}`);

            console.log(
                `Socket ${socket.id} joined concours_${concours_id}`
            );

        });

        socket.on("leave-concours", ({ concours_id }) => {

            socket.leave(`concours_${concours_id}`);

            console.log(
                `Socket ${socket.id} left concours_${concours_id}`
            );

        });

        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */
        socket.on("join_admin", () => {
            socket.join("admin_room");
        });

        /*
        |--------------------------------------------------------------------------
        | MODULES
        |--------------------------------------------------------------------------
        */
        ordersSocket(io, socket);
        votesSocket(io, socket);

        /*
        |--------------------------------------------------------------------------
        | DISCONNECT
        |--------------------------------------------------------------------------
        */
        socket.on("disconnect", (reason) => {

            console.log("User disconnected :", reason);

            Object.keys(global.connectedAgents).forEach((shopId) => {

                global.connectedAgents[shopId] =
                    global.connectedAgents[shopId]
                        .filter(agent => agent.socketId !== socket.id);

            });

        });

    });

};