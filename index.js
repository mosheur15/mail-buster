'use strict'
import nodemailer from 'nodemailer'
import commander from 'commander'
import enquirer from 'enquirer'
import path from 'path'
import fs from 'fs'
import joi from 'joi'


function GenTransport(user, pass, host, port) {
    return nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: user,
            pass: pass,
        }
    })
}


function parseArgs(args){
    return commander.program.version('1.0.0')
        .requiredOption('-s, --sender <address>', 'sender address.')
        .requiredOption('-t, --target <address...>', 'reciver addtesses.')
        .option('-h, --host <host>', 'hostname of sender address.')
        .option('-p, --port <port>', 'port to connect with host')
        .parse(args)
        .opts()
}

async function getPass(msg){
    let ans = await enquirer.prompt({
        type: 'password',
        name: 'value',
        message: msg,
        validate: val => val.trim() ? true : false,
    })
    return ans.value
}

async function input(msg){
    let ans = await enquirer.prompt({
        type: 'input',
        name: 'value',
        message: msg,
        validate: val => val.trim() ? true : false,
    })
    return ans.value
}

function validAddr(addr){
    let validation = joi.string()
        .email()
        .required()
        .validate(addr)
    return validation.error ? false : true
}

function services(filePath){
    try{
        if (!fs.existsSync(filePath)) return false
        if (!fs.lstatSync(filePath).isFile()) return false
        let buffer = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(buffer)
    }catch(e){
        return false
    }
}


async function main(){
    let args = await parseArgs(process.argv)
    
    for (let addr of [args.sender, ...args.target]){
        if (!validAddr(addr)){
            console.error(`invalid address '${addr}'`)
            process.exit()
        }
    }
    
    let servInfo = services(path.resolve('services.json'))
    if (!servInfo){
        console.warn(`cannot load '${ path.resolve('services.json') }' invlaid file!`)
        servInfo = {}
    }
    
    let srvName  = args.sender.split('@')[1].split('.')[0]
    let senderSrv
    
    if (!servInfo[srvName]){
        senderSrv = {
            host: await input('hostname'),
            port: await input('port'),
        }
    }
}

await main()