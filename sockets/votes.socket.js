module.exports = (io, socket) => {

  /*
  |--------------------------------------------------------------------------
  | VOTE REALTIME
  |--------------------------------------------------------------------------
  */
  socket.on("vote_casted", (data) => {
    // data = { concoursId, count, candidatureId }

    console.log("Vote received :", data);

    // ROOM CONCOURS
    io.to(`concours_${data.concoursId}`).emit("votes_updated", data);

    // ROOM ADMIN
    io.to("admin_room").emit("global_votes_update", data);
  });

  /*
  |--------------------------------------------------------------------------
  | LIVE RANKING UPDATE
  |--------------------------------------------------------------------------
  */
  socket.on("ranking_update", (data) => {
    io.to(`concours_${data.concoursId}`).emit("ranking_updated", data);
  });

};