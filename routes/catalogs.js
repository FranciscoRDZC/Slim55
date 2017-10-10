const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

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

//Gender method wich return data from database.
router.get('/gender', (req, res) => {
    jwt.verify(req.headers["token"], 'key', function (err, decoded) {
        if (err) {
            res.sendStatus(403);
        } else {
            con.query('Select GenderID,Gender From catGender Where Active = 1', function (err, rows) {
                if (err) {
                    res.json({
                        "status": "Error",
                        "message": err
                    });
                }
                else {
                    res.json({
                        "status": "OK",
                        "data": rows
                    });
                }
            });
        }
    });

});

//Return type of plan objetives.
router.get('/objective', (req, res) => {
    jwt.verify(req.headers["token"], 'key', function (err, decoded) {
        if (err) {
            res.sendStatus(403);
        } else {
            con.query('Select GenderID,Gender From catGender Where Active = 1', function (err, rows) {
                if (err) {
                    res.json({
                        "status": "Error",
                        "message": err
                    });
                }
                else {
                    res.json({
                        "status": "OK",
                        "data": rows
                    });
                }
            });
        }
    });
});

module.exports = router;