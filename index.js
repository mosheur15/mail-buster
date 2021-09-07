'use strict'
import nodemailer from 'nodemailer'
import commander from 'commander'
import chalk from 'chalk'
import fs from 'fs'
import input from './lib/promptQuery.js'
import loadJson from './lib/jsonLoader.js'
import validators from './lib/validators.js'


async function parseArgs(args) {
    let parsed = {}
    
    if (args.sender){
        let list = args.sender.split(':').filter(a=>a)
        let addr = list[0].trim()
        let pass = args.sender.replace(list[0]+':', '')
        
        if (!validators.validateAddress(addr)){
            console.log(`${ chalk.red('Error:') } invalid email address '${ addr }'`)
            process.exit()
        }
        
        if (!pass){
            pass = await input.password(`password for (${ addr })`)
        }
        
        parsed.sender = { addr, pass }
    }
    else {
        parsed.sender = {
            addr: await input.sender ('sender address'),
            pass: await input.password ('password'),
        }
    }
    
    if (args.reciver){
        let tmp = []
        for (let item in args.reciver){
            let is_file = validators.pathStat(item).file
            let is_addr = validators.validateAddress(item)
            if (!(is_file || is_addr)){
                console.log(`${chalk.red('Error:')} '${ item }' is not a valid address or a filename.`)
                process.exit
            }
            if (is_file && is_addr){
                console.log(`'${ item }' is a valid address also a file path.`)
                process.exit()
            }
            if (is_file){
                let buff = fs.readFileSync(item, 'utf-8')
                let list = buff.split('\n').filter(a=>a.trim())
                tmp      = [ ...tmp, ...list]
            }
        }
    }
}

async function main() {
    const settings = loadJson('./package.json') // load package.json
    const version  = settings.version           // get package version from package.json
    const program  = commander.program
    
    program.version(version)
    .option('-s, --sender <address>', 'sender email address.')
    .option('-r, --reciver <address...>', 'reciver email addresses.')
    .option('-S, --save', 'save login info to avoid entering password.')
    .parse(process.argv)
    
    const args = parseArgs(program.opts())
    console.log(args)
}

await main()