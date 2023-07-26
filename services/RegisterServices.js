const db = require('./db')
const bycrpt = require ('bcrypt')

async function checkUserEmail(User) {
    const sql = `SELECT * FROM dtuser WHERE username = '${User.username}'OR email = '${User.email}'`
    const result = await db.query(sql)

    return result
}
async function hashpassword(User){
    const saltRounds = 10
    const hashedPass = await bycrpt.hash(User.password, saltRounds)

    return hashedPass;
}

async function RegisterUser(User, hashedPass){
    const sql = `INSERT INTO dtuser (username,password,email) VALUES 
    ('${User.username}', '${hashedPass}', '${User.email}')`
    const result = await db.query(sql)
    let message = 'Error in Creating New Sales Data'

    if (result.affectedRows){
        message = 'Sales Data was successfully created'
    }

    return {message}
}

module.exports = {
    checkUserEmail,
    RegisterUser,
    hashpassword
}