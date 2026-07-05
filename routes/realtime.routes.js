const express = require("express");
const router = express.Router();
const {
  newOrder,
  orderStatusUpdated,
  ordersCount,
  newOrderKitchen,
  newSaleKitchen,
  votesCount
} = require("../controllers/realtime.controller");

router.post("/new-order", newOrder);
router.post("/order-status-updated", orderStatusUpdated);
router.post("/orders-count", ordersCount);
router.post("/new-order-kitchen", newOrderKitchen);
router.post("/new-sale-kitchen", newSaleKitchen);
router.post("/votes-updated", require("../controllers/realtime.controller").votesCount);

module.exports = router;