const RegisterServices = require('../services/RegisterServices')

const registerUser = async function (req, res, next) {
    const {email} = req.body
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({errors: 'Invalid Email Format Please use the Correct Email Format'});
    }
    
    let checkUserEmail = await RegisterServices.checkUserEmail(req.body)
    if (checkUserEmail.length > 0){
        return res.status(409).json({ error: 'Username or email already exists' });
    }
    let hashedPassword = await RegisterServices.hashpassword(req.body)
    try {
        res.json (await RegisterServices.RegisterUser(req.body, hashedPassword));
    } catch (err) {
        console.error(`Error while creating Users`, err.message);
      next(err);
    }    
}


module.exports = {
    registerUser,
}