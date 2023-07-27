const db = require ('../connection')
const salesService = require('../services/SalesServices')
const Pkg = require('../pkg')

const getAllSales =  async function (req,res,next)   {
  const roles = await Pkg.roles(req.user)
  if (roles) {
    return res.status(403).json({ error: 'You are not authorized to access this route' });
  }
    try {
      res.json(await salesService.getAll())
    } catch (err) {
      console.error('Error while getting Sales Data', err.message)
      next (err)
    }
}

const getSalesById = async function(req, res, next)  {
    try {
      res.json(await salesService.getSalesId(req.params.id))
    } 
    catch (err) {
      console.error('Error while getting Sales Data', err.message)
      next (err)
    }
}
const createSales = async (req, res, next) => {
    
  const roles = await Pkg.roles(req.user)
  if (roles) {
    return res.status(403).json({ error: 'You are not authorized to access this route' });
  }
  
   let checknama = await salesService.checkNama(req.body)
   if (checknama.length > 0){
    res.status(400).json({error : 'Nama Already Exist'})
    return;
   }
   let checkkota = await salesService.checkKota(req.body)
    if(checkkota.length === 0){
      res.status(400).json({error : 'Kota Not Exist'})
      return;
    }
    let generateId = await salesService.GenerateSalesId()
    try {
      res.json(await salesService.createSales(req.body, generateId.nextKode))
    } catch (err) {
      console.error(`Error while creating Sales`, err.message);
      next(err);
    }

}
const updateSales = async function (req, res, next) {
  const roles = await Pkg.roles(req.user)
  if (roles) {
    return res.status(403).json({ error: 'You are not authorized to access this route' });
  }
    let checknama = await salesService.checkNama(req.body)
   if (checknama.length > 0){
    res.status(400).json({error : 'Nama Already Exist'})
    return;
   }
   let checkkota = await salesService.checkKota(req.body)
    if(checkkota.length === 0){
      res.status(400).json({error : 'Kota Not Exist'})
      return;
    }
    let salesDateCheck = await salesService.checkSalesDate(req.params.id)
    let transactionValidaton = await salesService.validateTransaction(req.params.id, salesDateCheck.createdDate)
    if (transactionValidaton.length > 0) {
      res.status(400).json({ error: 'Cannot update. There are sales transactions with dates earlier than the specified date' });
      return;
    }
    try {
    res.json (await salesService.updateSales(req.params.id, req.body))
    } catch (error) {
      console.error(`Error while updating Sales`, err.message);
      next(err);
    }

}
const deleteSales = async function (req, res, next) {
  const roles = await Pkg.roles(req.user)
  if (roles) {
    return res.status(403).json({ error: 'You are not authorized to access this route' });
  }
  
  let checksell = await salesService.checkSell(req.params.id)
  if (checksell.length > 0) {
    res.status(400).json({ error: 'Cannot Delete. There are sales transactions that have done by this sales' });
    return;
  }
  try {
    res.json(await salesService.deleteSales(req.params.id))
  } catch (err) {
    console.error(`Error while deleting Sales`, err.message);
    next(err);
  }

  }
module.exports = {
    getAllSales,
    getSalesById,
    createSales,
    updateSales,
    deleteSales
}