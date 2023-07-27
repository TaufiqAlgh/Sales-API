const express = require('express')
const router = express.Router()
const {getAllSales,getSalesById,createSales,updateSales, deleteSales} = require('../controllers/SalesControllers')
const {loginUser,authenticateToken, authenticateAdmin} = require('../controllers/LoginControllers')
const {registerUser} = require('../controllers/RegisterControllers')



router.get('/',authenticateToken([1,2]), getAllSales);
router.get('/:id',authenticateToken([1,2]), getSalesById);
router.post('/',authenticateToken([2]), createSales);
router.put('/:id',authenticateToken([2]), updateSales);
router.delete ('/:id',authenticateToken([2]), deleteSales);
router.post ('/login', loginUser);
router.post ('/register', registerUser);

  

module.exports = router;