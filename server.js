var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');
var fs = require("fs");

server.listen(8080)



app.get('/', (req, res) => {

    res.render('index.ejs');
});

// Open socket with each new connection
// Ouvre un canal (socket) pour chaque nouvelle connection
io.on("connection", socket => {

    // Listen event "pseudo" from the client
    // Ecoute l'évènement "pseudo" provenant du client
    socket.on("pseudo", pseudo => {

        // Get the current time
        // Récupère le temps courant
        let now_time = getTime();

        socket.pseudo = ent.encode(pseudo);
        console.log("pseudo: " + socket.pseudo);

        // Write in the log, the new client
        // Ecrit dans les logs l'arrivé d'un nouveau client
        writeLog(now_time + " - " + "new chatter :" + socket.pseudo)

        // Emit a new event with data for to show in the client side
        // Emet un nouvelle évènement avec des données pour l'afficher du côté client
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
 * 
 **/

 /**
  * Return a string of the current time
  * Retoune une chaine de caractère avec le temps courant
  */
function getTime() {
    let date = new Date();
    let h = (date.getHours() < 10 ? '0' : '') + date.getHours();
    let m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    return h + ':' + m + ':' + s;
}

/**
 * Add content in the file log : chat-log.txt
 * Rajoute du contenu dans le fichier log : chat-log.txt
 * @param {string} content 
 */
function writeLog(content) {

    fs.appendFile("chat-log.txt", content+"\r\n", (err) => {
        if (err) console.log(err);
        console.log("Successfully append to File.");
    });
}