// api-realtime/controllers/mt.controller.js
// Reçoit les événements de Laravel (MtRealtime::push) et les diffuse en Socket.IO.
//  - mt_cloture (contient des infos d'écarts) -> UNIQUEMENT la salle du bureau "admin_room"
//  - tous les autres événements              -> salle de l'agence + bureau

exports.mtEvent = (req, res) => {
  try {
    if (!global.io) return res.status(500).json({ success: false, message: "Socket.IO non initialisé" });

    const { event, shopId, payload } = req.body || {};
    if (!event || !shopId) return res.status(422).json({ success: false, message: "event et shopId requis" });

    const data = { shopId, ...(payload || {}), at: new Date().toISOString() };

    // le bureau reçoit toujours
    global.io.to("admin_room").emit(event, data);

    // l'agence reçoit tout SAUF la clôture (l'agent ne doit jamais voir pertes/excédents)
    if (event !== "mt_cloture") {
      global.io.to(`shop_${shopId}`).emit(event, data);
    }
    return res.json({ success: true });
  } catch (e) {
    console.error("mtEvent error :", e);
    return res.status(500).json({ success: false });
  }
};
