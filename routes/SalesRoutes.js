const express = require('express')
const router = express.Router()
const {getAllSales,getSalesById,createSales,updateSales, deleteSales} = require('../controllers/SalesControllers')
const {loginUser,authenticateToken} = require('../controllers/LoginControllers')



router.get('/',authenticateToken, getAllSales)
router.get('/:id',authenticateToken, getSalesById)
router.post('/',authenticateToken ,createSales);
router.put('/:id',authenticateToken ,updateSales)
router.delete ('/:id',authenticateToken , deleteSales)
router.post ('/login', loginUser)


  

module.exports = router;