//jquery library call starts
const express = require('express');
const app = express();
var http = require('http').createServer(app);   //server for client
var io = require('socket.io')(http);         //need socket.ko
var formidable = require('formidable');     //take for html form

//jquery library call ends


http.listen(8000, () => {       //listen method use (when user call the server, then server response aganist user call)
    console.log('listening on *:8000');
});
app.use('/files', express.static('files'));   //express.static takes the ('files') and store in patha('/files')

app.get('/images/Graphicloads-100-Flat-2-Chat-2.ico', (req, res) => {    //first get this path for recognized to the server
    res.sendFile(__dirname + '/images/Graphicloads-100-Flat-2-Chat-2.ico');  // response sendFile (send _dirname means(localhost:8000)),  i means declare this location in server
});
app.get('/js/jquery-3.4.1.min.js', (req, res) => {  // get jquery static file for recognized(চেনা) to the server
    res.sendFile(__dirname + '/js/jquery-3.4.1.min.js');    // and return this
});
app.get('/', (req, res) => {    // first get recognized the root path [ ('/') recognized is root path]
    res.sendFile(__dirname + '/signup.html');   //('/signup.html') means, when type /signup.html i said catch this page
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html'); // ('/chat') means catch this chat page
});
io.on('connection', (socket) => {   //connect the 'socket io'
    console.log('Thanks, you are connected');   //showing server side message
    socket.on('disconnect', () => {     //when disconned 'socket io' 
        console.log('Sorry, you are disconnected'); //showing server side message
    });

    //passing message in the server side
    socket.on('chat message', (msg) => {    
        //console.log(msg);
        io.emit('chat message', msg);   //emit works broadcasting ( take messages from a single sender and transmit to all endpoints user )
    });
});

// file uploading code starts
app.post('/uploadfile', function (req, res){  //post upload file then pass the request.
    var strFilePath = '';   //file path must string and blank this variable
    var form = new formidable.IncomingForm();  
    form.parse(req);
    form.on('fileBegin', function (name, file){  //fileBegin means, first store (file name & file path)
        file.path = __dirname + '/files/' + file.name;
    });
    form.on('file', function (name, file){  //first, 'on' this form and send file to others
        strFilePath = '/files/' + file.name;        
        res.send(JSON.stringify({"filePath":strFilePath,"fileName":file.name}));   //JSON' can convert any data type to string
    });
});
// file uploading code ends