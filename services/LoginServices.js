const db = require('./db')

async function FindUser(User){
    const sql = (`SELECT * FROM dtuser WHERE username = '${User.username}'`)
    const result = db.query(sql)

    return result
}

module.exports = {
    FindUser,
}