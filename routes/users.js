const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multers3 = require('multer-s3');
const multer = require('multer');
const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = bcrypt.genSaltSync(10);

//constant who connect to the database.
const con = mysql.createConnection({
    host: 'planeatdev.cdiyylnoe5gf.us-east-2.rds.amazonaws.com',
    user: 'slim55dev',
    password: 'slim12345',
    database: 'PlanEat'
});

//Verify the connection to the DataBase.
con.connect((err) => {
    if (err) {
        console.log('error: ' + err);
    } else {
        console.log('connected');
    }
});

//Amazon connection config.
aws.config.loadFromPath('./config.json');
aws.config.update({
    signatureVersion: '1v'
});

//Upload methods configuration.
var s3storage = new aws.S3({});
var Photopath;
var upload = multer({
    storage: multers3({
        s3: s3storage,
        bucket: 'planeat',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            Photopath = Date.now() + '_' + file.originalname;
            cb(null, 'usr/profile/' + Date.now() + '_' + file.originalname);
        }
    })
});

//login method which returns data of the user if the data are true.
router.post('/login', function(req, res){
    var email = req.body.Email;
    var password = req.body.Password;
    con.query('Select Pwd FROM catUsers Where Email = ?', [email],
    function(err, rows){
        if(err){
            res.json({
                "status": "Error",
                "message": err
            });
        }else{
            if(rows[0].Pwd === password){
                con.query('Call PlanEat_Select_catUsers_login(?)', [email], function(err, rows){
                    if(err){
                        res.json({
                            "status": "Error",
                            "message": err
                        });   
                    }else{
                        res.json({
                            "status":"OK",
                            "token": jwt.sign({}, 'key'),
                            "data" : rows[0]
                        });
                    }
                });
            }else{
                res.json({
                    "status": "Error",
                    "message": "Correo y/o contraseña erroneos"
                });
            }
            //const hash = rows[0].Pwd;
            //console.log(hash);
            //bcrypt.compare(password, hash).then(function(res){
            //    if(res == true){
            //        res.send(true);
            //    }
            //})
            //bcrypt.compare('D4rthL1nk', hash, function(err, response){
            //    console.log(response);
            //    if(err){
            //        res.json({
            //            "status": "Error",
            //            "message": err
            //        });
            //    }else{
            //        if(response === true){
            //            con.query('Call PlanEat_Select_catUsers_login(?)', [email], function(err, rows){
            //                res.json({
            //                    "status":"OK",
            //                    "data":rows[0]
            //                });
            //            });
            //        }else{
            //            res.json({
            //                "status":"Error",
            //                "message":"Usuario y/o contraseña erroneos"
            //            });
            //        }
            //    }
            //});
        }
    });
});

//Register method which recive data from the app to save into the database.
router.post('/register', function (req, res) {
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email; 
    var Password = req.body.Password;
    con.query('Call PlanEat_Insert_catUsers_Form(?,?,?,?)', 
    [FirstName, LastName, Email, Password], 
    function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "message": err
            });
        }
        else{
            if(rows.fieldCount == 0){
                res.json({
                    "status":"Error",
                    "message":"Usuario ya existente"
                });
            }else{
                res.json({
                    "status":"OK",
                    "token": jwt.sign({}, 'key'),
                    "data" : rows[0]
                });
            }
        }
    });
    //bcrypt.hash(Password, saltRounds, function(err, hash){
    //    con.query('Call PlanEat_Insert_catUsers_Form (?,?,?,?)',
    //    [FirstName, LastName, Email, hash],
    //    function (err, rows) {
    //        if (err) {
    //            res.json({
    //                "status": "Error",
    //                "message": err
    //            });
    //        } else {
    //            if(rows.fieldCount == 0){
    //                res.json({
    //                    "status":"Error",
    //                    "message":"Usuario ya existente"
    //                });
    //            }else{
    //                res.json({
    //                    "status": "OK",
    //                    "token": jwt.sign({}, 'key'),
    //                    "data": rows[0]
    //                });
    //            }
    //        }
    //    });
    //});
});

//Register method for the social networks.
router.post('/facebook_google', (req, res) => {
    var FirstName = req.body.FirstName;
    var LastName = req.body.LastName;
    var Email = req.body.Email;
    var FacebookID = req.body.FacebookID;
    var GoogleID = req.body.GoogleID;
    var Photo = req.body.Photo;
    con.query('Call PlanEat_Insert_catUsers_FacebookGoogle(?,?,?,?,?,?)',
        [FirstName, LastName, Email, FacebookID, GoogleID, Photo], function (err, rows) {
            if (err) {
                res.json({
                    "status": "Error",
                    "message": err
                });
            } else {
                res.json({
                    "status": "OK",
                    "token": jwt.sign({}, 'key'),
                    "message": rows[0],
                    "data": rows[1]
                });
            }
        });
});

//Recive user plan from the app
router.post('/plandata', (req, res) => {
    jwt.verify(req.headers["token"], 'key', function (err, decoded) {
        if (err) {
            res.sendStatus(403);
        } else {
            var ID = req.body.ID;
            var ObjectiveID = req.body.ObjectiveID;
            var Rate = req.body.Rate;
            var GenderID = req.body.GenderID;
            var Weight = req.body.Weight;
            var Height = req.body.Height;
            var BirthDay = req.body.BirthDay;
            var KindFoodID = req.body.KindFoodID;
            con.query('Call PlanEat_Insert_catUsers_UserPlanData(?,?,?,?,?,?,?,?)',
                [ID, ObjectiveID, Rate, GenderID, Weight, Height, BirthDay, KindFoodID],
                function (err, rows) {
                    if (err) {
                        res.json({
                            "status": "Error",
                            "message": err
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "message": rows[0]
                        });
                    }
                });
        }
    });

});

//Recibe the profile photo
router.post('/uploadavatar', upload.single('Avatar'), function (req, res, next) {
    jwt.verify(req.headers["token"], 'key', function (err, decoded) {
        if (err) {
            res.sendStatus(403);
        } else {
            var UserID = req.body.UserID;
            Photopath = Photopath.replace(/ /g, '+');
            con.query('Update catUsers Set Photo = ? Where UserID = ?', [Photopath, UserID],
                function (err, rows) {
                    if (err) {
                        res.json({
                            "status": "ERROR",
                            "message": err
                        });
                    } else {
                        res.json({
                            "status": "OK",
                            "link": "https://s3.us-east-2.amazonaws.com/planeat/usr/profile/" + Photopath
                        });
                    }
                });
        }
    });
});


module.exports = router;