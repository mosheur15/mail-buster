#! /usr/bin/node
'use strict'
import commander from 'commander'
import chalk from 'chalk'
import enquirer from 'enquirer'
import fs from 'fs'

const program = commander.program
const smtpList = {
    'gmail': 'smtp.gmail.com',
    'yahoo': 'smtp.hotmail.com',
    'hotmail': 'smtp.hotmail.com',
    'outlook': 'smtp.outlook.com',
}

const askSmtp = {
    'type': 'input',
    'name': 'service',
    'message': 'enter smtp address',
}

async function parseFile(filepath) {
    if (!fs.existsSync(filepath)) return false
    return filepath
}

async function predictSmtp(addr){
    let service = addr.split('@')[1].split('.')[0]
    if (smtpList[service]) return smtpList[service]
    return false
}

function main (){
    program.version('1.0.0')
    .option('-b, --bulk', 'send bulk emails.')
    .option('-F, --file', 'load files.')
    .option('-f, --format <format>', 'file format.', 'txt')
    .requiredOption('-u, --user <user>', 'address of sender.')
    .requiredOption('-t, --target <target...>', 'target address.')
    .parse(process.argv)
    
    let args = program.opts()
    
    if (!(args.format==='txt'||args.format==='json')){
        console.log(`${ chalk.red('Error:') } invalid file format '${args.format}'. valid formats are txt, json`)
        process.exit()
    }
    
    if (args.file){
        let valid = Promise.all([ parseFile(args.user), parseFile(args.target) ])
        if (!valid[0]){
            console.log(`${ chalk.red('Error:') } invalid path '${ args.user }'`)
            process.exit()
        }
        if (!valid[1]){
            console.log(`${ chalk.red('Error:') } invalid path '${ args.target }'`)
            process.exit()
        }
    }
    
    console.log(args)
}