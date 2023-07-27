async function emailRegex(User){
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    const result = regex.test(User.email)
    return result
}

async function roles(User){
    const roles = User.role !== 2

    return roles
}
module.exports = {
    emailRegex,
    roles
}