const jwt = require('jsonwebtoken');
const LoginService = require('../services/LoginServices')
const bcrypt = require('bcrypt')
const Pkg = require('../pkg')
const secretKey = 'topikganteng'

const loginUser = async function (req, res, next) {
    const {password} = req.body
    let emailregex = await Pkg.emailRegex(req.body)
    if (!emailregex){
      return res.status(400).json({errors: 'Invalid Email Format Please use the Correct Email Format'});
    }
    
    let login = await LoginService.FindUser(req.body)
    if (login.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = login[0]
  
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    })

    const token = jwt.sign({ userId: user.id, username: user.username, role: user.roles_id }, secretKey, { expiresIn: '1h' });

    res.json({ token})
}


function authenticateToken(User){
  return function (req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
      const userRole = decoded.role
      
      if(!User.includes(userRole)){
        return res.status(403).json({ error: 'You are not authorized to acces this route'})
      }
      
      req.user = decoded;
      next();
    });
    
  }
}


//Double Middleware

// function authenticateToken(req, res, next) {
//       const token = req.headers['authorization'];
  
//       if (!token) {
//           return res.status(401).json({ error: 'No token provided' });
//         }
  
//     jwt.verify(token, secretKey, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ error: 'Invalid token' });
//       }
  
//       req.user = decoded;
//       next();
//     });
//   }

// function authenticateAdmin(req, res, next) {
//   if (req.user.role !== 2) {
//     return res.status(403).json({ error: 'You are not authorized to access this route' });
//   }

//   next();
// }
module.exports = {
  loginUser,
  authenticateToken,
}