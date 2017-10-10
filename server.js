const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const router = express.Router();
const path = require('path');
const users = require('./routes/users.js');
const catalogs = require('./routes/catalogs.js')

//Parser from post body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.all('/*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods','GET,POST');
    res.header('Access-Control-Allow-Headers', "*");
    //console.log(res.getHeader(name));
    next();
});

//Handle error routes.
router.get('/', function(req, res){
    res.status(404);
    res.setHeader('Content-type', 'text/html');
    res.sendfile(path.join(__dirname + '/html/Error.html'));
});
router.post('/', function(req, res){
    res.status(404);
    res.setHeader('Content-type', 'text/html');
    res.sendfile(path.join(__dirname + '/html/Error.html'));
});
router.get('/Docs', function(req, res){
    res.setHeader('Content-type', 'text/html');
    res.sendFile(path.join(__dirname + '/html/Documentation.html'));
});

//Routes of API
app.use('/',router);
app.use('/users', users);
app.use('/catalogs', catalogs);
app.use(function(req, res, next){
    next();
});

//Listener of port: 8000
app.listen(port, () => {
    console.log('Live port: ' + port);
});

module.exports = app;