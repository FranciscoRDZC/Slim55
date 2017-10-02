const express = require('express');
const router = express.Router();
const mysql = require('mysql');
//constant who connect to the database.
const con = mysql.createConnection({
    host: 'planeatdev.cdiyylnoe5gf.us-east-2.rds.amazonaws.com',
    user: 'slim55dev',
    password: 'slim12345',
    database: 'PlanEat'
});
//const con = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'D4rthL1nk',
//    database: 'Slim55'
//});
//Verify the connection to the DataBase.
con.connect((err) => {
    if(err){
        console.log('error: ' + err);
    }else{
        console.log('connected');
    }
});
//Gender method wich return data from database.
router.get('/gender', (req, res) => {
    con.query('Select GenderID,Gender From catGender Where Active = 1', function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "message":err
            });
        }
        else{
            res.json({
                "status":"OK",
                "data":rows
            });
        }
    });
});
//
router.get('/objective', (req, res) => {
    con.query('Select ObjectiveID, Objective From catObjective Where Active = 1', function(err, rows){
        if(err){
            res.json({
                "status":"Error",
                "message": err
            });
        }else{
            res.json({
                "status":"OK",
                "data":rows
            });
        }
    });
});

module.exports = router;