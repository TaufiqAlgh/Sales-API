const db = require('./db')

async function FindUser(User){
    const sql = (`SELECT * FROM dtuser WHERE email = '${User.email}'`)
    const result = db.query(sql)

    return result
}

module.exports = {
    FindUser,
}