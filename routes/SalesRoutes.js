const express = require('express')
const router = express.Router()
const {getAllSales,getSalesById,createSales,updateSales, deleteSales} = require('../controllers/SalesControllers')



router.get('/',getAllSales)
router.get('/:id',getSalesById)
router.post('/',createSales);
router.put('/:id',updateSales)
router.delete ('/:id', deleteSales)
  

module.exports = router;