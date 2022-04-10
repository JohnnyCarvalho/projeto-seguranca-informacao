const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
var bodyParser = require('body-parser');
const cors = require('cors');
var jsonParser = bodyParser.json()
const config = require("../config.json");

let app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.post("/register", jsonParser, (req, res) => { 
    let userName = req.body.name;
    let password = req.body.password;
    if(config.securityActive){
        if(!userName || userName.length < 5){
            res.send({
                success: false,
                message: "Seu nome de usuário precisa ter ao menos 5 caracteres."
            })
        }
        let passwordValidation = validateSecurePassword(password);
        if(password.success == false){
            res.send(passwordValidation);
        }
    } else {
        if(!userName || userName.length != 4){
            res.send({
                success: false,
                message: "Nome de usuário inválido."
            })
        }    
        if(!validateInsecurePassword(password)){
            res.send({
                success: false,
                message: "Senha inválida."
            })
        }
    }
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
    } else if(userFound.loginAttempts > 4 && new Date(userFound.lastLoginAttempt) > Date.now() - (60 * 1000) && config.securityActive){
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
    fs.writeFileSync("./db.json", JSON.stringify(data));
}

function readJsonFile(){
    return JSON.parse(fs.readFileSync("./db.json"));
}

function md5(string){
    return crypto.createHash("md5").update(string).digest("hex");
}

function validateInsecurePassword(password){
    return password && password.length == 4;
}

function validateSecurePassword(password){
    if (!password || password.length < 8) {
        return {
            success:false,
            message:"Sua senha precisa ter no mínimo 8 caracteres."
        };
    }
    if(password.search(/[a-z]/) == -1){
        return {
            success:false,
            message:"Sua senha precisa ter no mínimo uma letra minúscula."
        }
    }
    if(password.search(/[A-Z]/) == -1){
        return {
            success:false,
            message:"Sua senha precisa ter no mínimo uma letra maiúscula."
        }
    }
    if(password.search(/[0-9]/) == -1){
        return {
            success:false,
            message:"Sua senha precisa ter no mínimo um número."
        }
    }
    if(password.search(/[!@#$%^&*]/) == -1){
        return {
            success:false,
            message:"Sua senha precisa ter no mínimo um caractere especial."
        }
    }
    return {
        success:true,
        message:"Senha válida!"
    }
}

app.listen(config.serverPort, '127.0.0.1');
console.log('Node server running on port ' + config.serverPort);