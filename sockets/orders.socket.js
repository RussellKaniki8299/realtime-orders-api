module.exports = (io, socket) => {
  // NEW ORDER
  socket.on("new_order", (data) => {
    console.log("New order received :", data);
    io.to(`shop_${data.shopId}`).emit("receive_order", data);
    io.to(`shop_agents_${data.shopId}`).emit("receive_order_agent", data);
  });

  // NEW ORDER KITCHEN
  socket.on("new_order_kitchen", (data) => {
    console.log("New order kitchen :", data);
    io.to(`shop_kitchen_${data.shopId}`).emit("receive_order_kitchen", data);
  });

  // NEW SALE KITCHEN
  socket.on("new_sale_kitchen", (data) => {
    console.log("New sale kitchen :", data);
    io.to(`shop_kitchen_${data.shopId}`).emit("receive_sale_kitchen", data);
  });
};