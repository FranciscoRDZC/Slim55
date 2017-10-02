const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer'); 
//constant who connect to the database.
const con = mysql.createConnection({
    host: 'planeatdev.cdiyylnoe5gf.us-east-2.rds.amazonaws.com',
    user: 'slim55dev',
    password: 'slim12345',
    database: 'PlanEat'
});
var photopath = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'upload/')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: photopath}).single('usrphoto')

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
    var email = req.body.Email;
    var pwd = req.body.Password;
    con.query('Call PlanEat_Select_catUsers_login(?,?)', [email, pwd], function(err, rows){
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
router.post('/form',function(req, res){
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email;
    var Password = req.body.Password;
    con.query('Call PlanEat_Insert_catUsers_Form (?,?,?,?)',
    [FirstName, LastName, Email, Password], 
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
router.post('/facebook_google', (req, res) => {
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email;
    var FacebookID = req.body.FacebookID;
    var GoogleID = req.body.GoogleID;
    var Photo = req.body.Photo;
    con.query('Call PlanEat_Insert_catUsers_FacebookGoogle(?,?,?,?,?,?)',
    [FirstName, LastName, Email, FacebookID, GoogleID, Photo], function(err, rows){
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
//
router.post('/plandata', (req, res) => {
    var ID = req.body.ID;
    var ObjectiveID =req.body.ObjectiveID;
    var Rate = req.body.Rate;
    var GenderID = req.body.GenderID;
    var Weight = req.body.Weight;
    var Height = req.body.Height;
    var BirthDay = req.body.BirthDay;
    var KindFoodID = req.body.KindFoodID;
    //var Photo = req.body.Photo;
    con.query('Call PlanEat_Insert_catUsers_UserPlanData(?,?,?,?,?,?,?,?)', 
    [ID, ObjectiveID, Rate, GenderID, Weight, Height, BirthDay, KindFoodID],
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
//
router.post('/usrphoto', function(req,res) {
    upload(req, res, function(err){
        if(err){
            res.json({
                "status":"fail",
                "message": err
            });
        }else{
            res.json({
                "status":"OK",
                "message":"Foto almacenada"
            });
        }
    })
});

module.exports = router;