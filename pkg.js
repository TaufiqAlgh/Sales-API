async function emailRegex(){
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    
    return regex
}

module.exports = {
    emailRegex
}