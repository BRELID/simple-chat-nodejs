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

        io.emit("new_chatter", {
            pseudo: socket.pseudo,
            time: getTime()
        })
        console.log("pseudo: " + socket.pseudo);
    });

    socket.on("msg_content", message => {
        console.log("server receive message: " + message + ", by " + socket.pseudo);

        io.emit("msg_chat", {
            msg_chat: ent.encode(message),
            pseudo: socket.pseudo,
            time: getTime()
        })
    })


    socket.on("disconnect", () => {

        io.emit("chatter_leave", {
            pseudo: socket.pseudo,
            time: getTime()
        })
        console.log("chatter_leave: " + socket.pseudo)
    });
});


/**
 * 
 * Functions
 **/

function getTime() {
    let date = new Date();
    let h = (date.getHours() < 10 ? '0' : '') + date.getHours();
    let m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    return h + ':' + m + ':' + s;
}