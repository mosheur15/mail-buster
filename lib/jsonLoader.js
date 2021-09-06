'use strict'
import fs from 'fs'

export default function (path) {
    try{
        let buff = fs.readFileSync(path, 'utf-8')
        return JSON.parse(buff)
    }catch(e){
        return false
    }
}