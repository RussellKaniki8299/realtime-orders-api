exports.newOrder = async (req, res) => {
  try {
    const data = req.body;
    console.log("Nouvelle commande :", data);
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    global.io.to(`shop_${data.shopId}`).emit("receive_order", data);
    global.io.to(`shop_agents_${data.shopId}`).emit("receive_order_agent", data);

    const agents = global.connectedAgents?.[data.shopId] || [];
    console.log(`\n=== Shop : ${data.shopId} ===`);
    if (agents.length > 0) {
      console.log(`Agents notifiés (${agents.length}) :`);
      agents.forEach((a, i) => console.log(`${i + 1}. ${a.nom} | ${a.role} | userId=${a.userId}`));
    } else {
      console.log("Aucun agent connecté.");
    }

    return res.json({ success: true, message: "Commande envoyée en temps réel", notifiedAgents: agents });
  } catch (error) {
    console.error("Erreur realtime :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.orderStatusUpdated = async (req, res) => {
  try {
    const data = req.body;
    console.log("Status commande update :", data);
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    global.io.to(`client_${data.clientId}`).emit("order_status_updated", data);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
};

exports.ordersCount = async (req, res) => {
  try {
    const { shopId, count } = req.body;
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    global.io.to(`shop_${shopId}`).emit("shop_orders_count", { shopId, count });
    global.io.to(`shop_agents_${shopId}`).emit("shop_orders_count", { shopId, count });
    console.log(`Count envoyé realtime shop ${shopId} : ${count}`);
    return res.json({ success: true });
  } catch (error) {
    console.error("ordersCount error :", error);
    return res.status(500).json({ success: false });
  }
};

exports.newOrderKitchen = async (req, res) => {
  try {
    const data = req.body;
    console.log("Nouvelle commande cuisine :", data);
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    global.io.to(`shop_kitchen_${data.shopId}`).emit("receive_order_kitchen", data);
    return res.json({ success: true, message: "Commande cuisine envoyée" });
  } catch (error) {
    console.error("Erreur newOrderKitchen :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.newSaleKitchen = async (req, res) => {
  try {
    const data = req.body;
    console.log("Nouvelle vente cuisine :", data);
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    global.io.to(`shop_kitchen_${data.shopId}`).emit("receive_sale_kitchen", data);
    return res.json({ success: true, message: "Vente cuisine envoyée" });
  } catch (error) {
    console.error("Erreur newSaleKitchen :", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.votesCount = async (req, res) => {
  try {
    const { concoursId, count } = req.body;

    if (!global.io)
      return res.status(500).json({ success: false });

    // ROOM CONCOURS
    global.io.to(`concours_${concoursId}`).emit("votes_count", {
      concoursId,
      count
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("votesCount error :", error);
    return res.status(500).json({ success: false });
  }
};