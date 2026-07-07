module.exports = (io, socket) => {


  socket.on("vote_casted", (data) => {

    console.log("Vote received :", data);

    io.to(`concours_${data.concoursId}`)
      .emit("votes_updated", data);


    io.to("admin_room")
      .emit("global_votes_update", data);

  });


};