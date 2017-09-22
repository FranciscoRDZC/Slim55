const express = require('express');
const router = express.Router();
const mysql = require('mysql');
//constant who connect to the database.
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D4rthL1nk',
    database: 'Slim55'
});
//Verify the connection to the DataBase.
con.connect((err) => {
    if(err){
        console.log('error: ' + err);
    }else{
        console.log('connected');
    }
});
//login method which returns data of the user if the data are true.
router.post('/login',function(req, res){
    var email = req.body.email;
    var pwd = req.body.pwd;
    con.query('Call Slim55.Slim55_Select_catUsers_loggin(?,?)', [email, pwd], function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "message":err
            });
        }
        else{
            res.json({
                "status":"OK",
                "message":rows[0]
            });
        }
    });
});
//register method which recive data from the app to save into the database.
router.post('/register',function(req, res){
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email;
    var Password = req.body.Password;
    var ObjectiveID = req.body.ObjectiveID;
    var Rate = req.body.Rate;
    var GenderID = req.body.GenderID;
    var W = req.body.Weight;
    var H = req.body.Height;
    var BD = req.body.BirthDay;
    var KindFoodID = req.body.KindFoodID;
    var Photo = req.body.Photo;
    var Active = req.body.Active;
    con.query('Call Slim55_Insert_catUsers(?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [FirstName, LastName, Email, Password, ObjectiveID, Rate, GenderID, W, H, BD, KindFoodID, Photo, Active], 
    function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "message":err
            });
        }else{
            res.json({
                "status":"OK",
                "data":rows[0]
            });
        }
    });
});
//register method for the social networks.
router.post('/register_facebook_google', (req, res) => {
    console.log(req.body);
    res.end();
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email;
    var FacebookId = req.body.FacebookID;
    var GoogleID = req.body.GoogleID;
    var ObjectiveID = req.body.ObjectiveID;
    var Rate = req.body.Rate;
    var GenderID = req.body.GenderID;
    var Weight = req.body.Weight;
    var Height = req.body.Height;
    var BD = req.body.BirthDay;
    var KindFoodID = req.body.KindFoodID;
    var Photo = req.body.Photo;
    var Active = req.body.Active;
    con.query('Call Slim55_Insert_catUsers_FacebookGoogle(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [FirstName,LastName, Email, FacebookId, GoogleID, ObjectiveID,Rate, GenderID
        , Weight, Height, BD, KindFoodID,Photo,Active], function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "mess":err
            });
        }else{
            res.json({
                "status":"OK",
                "data":rows[0]
            });
        }
    });
});

module.exports = router;