/*jshint node: true */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    io = require('socket.io');


var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    mongoserver = new Server('localhost', 27017, {
        auto_reconnect: true
    }),
    db = new Db('test', mongoserver);



 var findUser = function(login) {
    
    var f = db.collection('login', function(err, col) {
/*        return col;
    });
    var res = col.findOne.toArray(function(err, q){
        return q;
    });

    console.log("==== res " + res);
    db.collection('login', function(err, collection) {
        var e;
        collection.findOne.toArray({login: 'Wojti'}, function(err, col){
           
            e = col.password;
        });

        console.log('** a ** ' + e);*/
       // return "test";
        col.find(function(err, cursor) {
            cursor.toArray(function(err, docs) {
                console.log("Found " + docs.length + " documents");
                var queryResults = [];
                for(var i = 0; i < docs.length; i++) {
                queryResults[queryResults.length] = docs[i];
                if(queryResults[i].login === login) {
                    var logged = login;
                    console.log("logged ---------------" + logged);
                }
              }
              return logged;
            });
        });
    });
};



 
var updateUser = function(name, pass) {
    var user = {
        login: name,
        password: pass
    };

    db.collection('login', function(err, collection) {
        collection.update(user);
    });

}; 
 

var findAllUsers = function() {
    db.collection('login', function(err, collection) {
        collection.find().toArray(function(err, results) {
        console.log(results);
        });
    });
};





var addUser = function(name, pass) {
        var user = {
            login: name,
            password: pass
        };
        db.collection('login', function(err, collection) {
            collection.insert(user);
        });
    };

var removeAllUsers = function() {

    db.collection('login', function(err, collection) {
            collection.remove();
        });
}



var server = http.createServer(function(req, res) {
    'use strict';
    var filePath = '.' + req.url,
        contentType = 'text/html',
        extName;

    console.log('request starting...' + filePath);
    if(filePath === './') {
        filePath = './index.html';
    }
    extName = path.extname(filePath);
    switch(extName) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    }

    path.exists(filePath, function(exists) {
        if(exists) {
            fs.readFile(filePath, function(error, content) {
                if(error) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

var socket = io.listen(server);
var zalogowany = 0;

socket.on('connection', function(client) {
    'use strict';

    client.on('login', function(msg) {
        //console.log("Pass form findUser: " + findUser(msg.name));
         //addUser(msg.name, msg.password);
        console.log("User found: " + findUser(msg.name));
        if(msg.name === 'Wojti') {
            zalogowany = 1;
            client.emit('login', 'Login: ' + msg.name);
        } else {
            client.emit('errorLogin', 'Login error!')
        }
    });

     client.on('insertProduct', function(msg) {
        console.log("Message: " + msg);
        client.emit('insertedProduct', 'Inserted product: ' + msg.productName);
       
    });
});

server.listen(3030);