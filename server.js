const express = require('express');
const path = require('path');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server)


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')


app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

// toda vez que o client conectar faça
io.on("connection", socket => {
    console.log(`Socket conectado:${socket.id}`);

    socket.emit('previousMessages',messages);// mandar mensagens anteriores
    //socket on: ouvir
    //socket emit: enviar : por exemplo uma mensagem
    //socket broadcast.emit: envia para todos os sockets conectados na aplicação
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});


server.listen(3000)