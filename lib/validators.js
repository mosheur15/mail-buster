'use strict'
import joi from 'joi'
import fs from 'fs'

const breakWord = (str) => str.replace(/\s\s+/g, ' ').split(' ')

function validateAddress (addr) {
    const value = joi.string()
        .email()
        .required()
        .validate(addr)
        
    if (value.error) return false
    return true
}

function pathStat(path) {
    if (!fs.existsSync(path)) return { missing: true }
    
    let stat = fs.lstatSync(path)
    if (stat.isFile()) return { file: true }
    if (stat.isDirectory()) return { dir: true }
    return { others: true }
}


function target(value) {
    value = value.trim()
    if (!value) return false
    let list = breakWord(value)
    
    for (let item of list){
        let is_addr = validateAddress(item)
        let stat = pathStat(item)
        if (is_addr || stat.file) continue
        return `'${ item }' is not a valid address or a file!`
    }
    
    return true
}

function sender(value) {
    value = value.trim()
    if (validateAddress(value)) return true
    return 'invalid email address!'
}

export default {
    validateAddress,
    pathStat,
    sender,
    target,
}