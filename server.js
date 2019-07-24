var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');
var fs = require("fs");

server.listen(8080)

app.get('/', (req, res) => {

    res.render('index.ejs');
});

io.on("connection", socket => {

    socket.on("pseudo", pseudo => {
        let now_time = getTime();

        socket.pseudo = ent.encode(pseudo);
        console.log("pseudo: " + socket.pseudo);
        writeLog(now_time + " - " + "new chatter :" + socket.pseudo)

        io.emit("new_chatter", {
            pseudo: socket.pseudo,
            time: now_time
        })
        
    });

    socket.on("msg_content", message => {
        let now_time = getTime();

        console.log("server receive message: " + ent.encode(message) + ", by " + socket.pseudo);
        writeLog(now_time + " - " + "new msg :" + ent.encode(message) + ", by " + socket.pseudo)

        io.emit("msg_chat", {
            msg_chat: ent.encode(message),
            pseudo: socket.pseudo,
            time: now_time
        })
    })


    socket.on("disconnect", () => {
        let now_time = getTime();
        writeLog(now_time + " - " + "chatter deco :" + socket.pseudo)

        io.emit("chatter_leave", {
            pseudo: socket.pseudo,
            time: now_time
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

function writeLog(content) {

    fs.appendFile("chat-log.txt", content+"\r\n", (err) => {
        if (err) console.log(err);
        console.log("Successfully append to File.");
    });
}