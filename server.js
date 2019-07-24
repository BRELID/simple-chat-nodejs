var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');


server.listen(8080)

app.get('/', (req, res) => {

    res.render('index.ejs');
});

io.on("connection", socket => {

    socket.on("pseudo", pseudo => {
        socket.pseudo = ent.encode(pseudo);
        io.emit("new_chatter", {pseudo: socket.pseudo})
        console.log("pseudo: "+socket.pseudo);
    });

    socket.on("msg_content", message => {
        console.log("server receive message: "+message+", by "+socket.pseudo);
        io.emit("msg_chat", {msg_chat: ent.encode(message), pseudo: socket.pseudo})
    })


    socket.on("disconnect", () => {
        io.emit("chatter_leave", {pseudo: socket.pseudo})
        console.log("chatter_leave: "+socket.pseudo)
    });
});


