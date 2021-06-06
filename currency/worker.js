var data = require ('./data.json')
const curr = require ('./init.js')
const allworkers = [{level: 1, price: 100, rate: 5}, {level: 2, price: 500, rate: 10}, {level: 3, price: 2500, rate: 25}]
function buy(id) {
    let currentWorkers = curr.getId(id).workers;
    if (curr.getId(id).balance < allworkers[currentWorkers.length].price) return msg.reply("Insufficent Shekels")
    curr.getId(id).workers = allworkers[currentWorkers.length]
    curr.getId(id).balance = curr.getId(id).balance - currentWorkers[currentWorkers.length].price
    curr.writeData(data)
    return msg.reply(`Purchaced a level ${currentWorkers[currentWorkers.length - 1].level} worker for ${currentWorkers[currentWorkers.length - 1].price} shekels`)
}
function get(id) {
    let currentWorkers = curr.getId(id).workers
    return msg.reply(currentWorkers)
}
module.exports = {buy, get, allworkers};