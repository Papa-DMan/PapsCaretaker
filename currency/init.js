const fs = require('fs')
var data = require ('./data.json')
exports.run = async (id) => {
    if (!data.includes(id)) {
    } else return
}
function newUser(id) {
    var user = {id: id, balance: 0, workers: []}
    data.push(user)
    writeData(data)
}
function writeData(data) {
    fs.writeFile('./data.json', JSON.stringify(data), (err) => {
        if (err) throw err
    })
}
function getId(id) {
    var data = require('./data.json')
    const isId = (element) => element = id;
    var index = data.findIndex(isId)
    console.log(index)
    console.log(data[index])
    return data[index]
}
module.exports = {newUser, writeData, getId};