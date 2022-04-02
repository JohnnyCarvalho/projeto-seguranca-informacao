const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
var bodyParser = require('body-parser');
const cors = require('cors');
var jsonParser = bodyParser.json()

let app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.listen(3030, () => console.log("App running o port 3030"));
app.post("/register", jsonParser, (req, res) => { 
    let userName = req.body.name;
    let password = req.body.password;
    let users = readJsonFile();
    if(users[userName]){
        res.send({
            success: false,
            message: "Usuário já existe"
        });
        return;
    }
    users[userName] = {};
    users[userName].password = md5(password);
    users[userName].loginAttempts = 0;
    users[userName].lastLoginAttempt = new Date();
    writeToJsonFile(users);
    res.send({
        success:true,
        message: "Usuário registrado com sucesso!"
    });
});
app.post("/login", jsonParser, (req, res) => {
    let userName = req.body.name;
    let password = req.body.password;
    let users = readJsonFile();
    let userFound = users[userName];

    if(!userFound){        
        res.send({
            success:false,
            message: "Usuário não encontrado!"
        });
    } else if(userFound.loginAttempts > 4 && new Date(userFound.lastLoginAttempt) > Date.now() - (60 * 1000)){
        userFound.loginAttempts++;
        userFound.lastLoginAttempt = Date.now();
        res.send({
            success:false,
            message: "Usuário bloqueado por muitas tentativas de login. Tente novamente em 1 minuto."
        });
    } else if(userFound.password === md5(password)){
        userFound.loginAttempts = 0;
        res.send({
            success:true,
            message:"Usuário logado com sucesso!"
        });     
    } else {
        userFound.lastLoginAttempt = new Date();
        userFound.loginAttempts++;
        res.send({
            success:false,
            message: "Senha incorreta!"
        });
    }
    writeToJsonFile(users);
    return;
});
app.get("/status", (req, res) => {
    res.send("Server is running!");
});

function writeToJsonFile(data){
    fs.writeFileSync("db.json", JSON.stringify(data));
}

function readJsonFile(){
    return JSON.parse(fs.readFileSync("db.json"));
}

function md5(string){
    return crypto.createHash("md5").update(string).digest("hex");
}


app.listen(3000, '127.0.0.1');
console.log('Node server running on port 3000');