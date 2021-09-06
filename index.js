'use strict'
import nodemailer from 'nodemailer'
import commander from 'commander'
import chalk from 'chalk'
import input from './lib/promptQuery.js'
import loadJson from './lib/jsonLoader.js'
import validators from './lib/validators.js'

async function main() {
    const settings = loadJson('./package.json') // load package.json
    const version  = settings.version           // get package version from package.json
    const program  = commander.program
    
    program.version(version)
    .option('-s, --sender <address>', 'sender email address.')
    .option('-t, --target <address...>', 'target email addresses.')
    .option('-S, --save', 'save login info to avoid entering password.')
    .parse(process.argv)
    
    const args = program.opts()
    
    // sender validation.
    if (!args.sender) {
        args.sender = {
            addr: await input.sender('sender address'),
            pass: await input.password('password')
        }
    }
    else {
        // split password and addr. remove emtpy item with filter if 
        // password is empty, example: 'addr@something.com:'
        // in the addr there is no password but sep ':' (colon) has been passed.
        // in this case split will add a empty item  [''] in the list. remove it with filter.
        let list = args.sender.split(':').filter(i=>i) 
        let tmp  = {}
        
        // validate email address.
        if (!validators.validateAddress(list[0].trim())){
            console.log(`${chalk.red('Error:')} invalid email '${ list[0] }'`)
            process.exit()
        }
        
        tmp.addr = list[0].trim()
        
        // parse password if passed with command line arguments.
        // example : 'address@someting.com:my_password'
        // prompt for password otherwise.
        if (list.length>1) tmp.pass = args.sender.replace(list[0]+':', '')   // list[0] => email address
        else tmp.pass = await input.password(`password for (${ tmp.addr })`)
        
        args.sender = tmp
    }
    
    console.log(args)
}

await main()