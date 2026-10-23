const express = require("express");
const router = express.Router();

const {
  newOrder,
  orderStatusUpdated,
  ordersCount,
  newOrderKitchen,
  newSaleKitchen,
  votesCount,
  classementUpdated
} = require("../controllers/realtime.controller");
const { mtEvent } = require("../controllers/mt.controller");


router.post("/new-order", newOrder);
router.post("/order-status-updated", orderStatusUpdated);
router.post("/orders-count", ordersCount);
router.post("/new-order-kitchen", newOrderKitchen);
router.post("/new-sale-kitchen", newSaleKitchen);

// Votes
router.post("/votes-updated", votesCount);

// Classement concours
router.post("/classement-updated", classementUpdated);
router.post("/mt-event", mtEvent);


module.exports = router;