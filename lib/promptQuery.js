'use strict'
import enquirer from 'enquirer'
import validators from './validators.js'

async function sender(msg) {
    let input = await enquirer.prompt({
        type: 'input',
        name: 'value',
        message: msg,
        validate: validators.sender
    })
    
    return input.value
}

async function password(msg) {
    let input = await enquirer.prompt({
        type: 'password',
        name: 'value',
        message: msg,
        validate: (value) => value.trim()?true:false
    })
    
    return input.value
}

async function target(msg) {
    let input = await enquirer.prompt({
        type: 'input',
        name: 'value',
        message: msg,
        validate: validators.target
    })
    
    return input.value
}

export default {
    sender,
    password,
    target
}