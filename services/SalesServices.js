const db = require ('./db')
const response = require ('../response')

async function getAll(){
    const sql = `SELECT * FROM mssalesman`
    const result = await db.query(sql)

    return result
}

async function getSalesId(id){
    const sql = `SELECT * FROM mssalesman WHERE sal_id = '${id}'`
    const result = await db.query(sql)

    return result;
}

async function checkNama(Sales){
    const sql = `SELECT * FROM mssalesman WHERE sal_nm = '${Sales.nama}'`
    const result = await db.query(sql)
    
    return result
}

async function checkKota(Sales){
    const sql = `SELECT * FROM mskota WHERE kta_id = '${Sales.kota}'`
    const result = await db.query(sql)
    
    return result;
}

async function GenerateSalesId(){
    const sql = `SELECT sal_id FROM mssalesman ORDER BY sal_id DESC LIMIT 1`
    const result = await db.query(sql)
    let nextKode = "S001"
    if(result.length > 0){
      const lastKode = result[0].sal_id;
      const lastNumber = parseInt(lastKode.substr(1));
      nextKode = `S${(lastNumber + 1).toString().padStart(3, '0')}`;
    }
    return {nextKode};
}

async function createSales(Sales, nextKode) {
    const sql = `INSERT INTO mssalesman (sal_id, sal_nm, sal_bekerjasejak, sal_kta_id) VALUES ('${nextKode}', '${Sales.nama}', CURDATE(), '${Sales.kota}')`
    const result = await db.query(sql)
    let message = 'Error in Creating New Sales Data'

    if (result.affectedRows){
        message = 'Sales Data was successfully created'
    }

    return {message}
}

async function checkSalesDate(id){
    const sql = `SELECT * FROM mssalesman WHERE sal_id = '${id}'`
    const result = await db.query(sql)
    let createdDate = result[0].sal_bekerjasejak
    return {createdDate};
}

async function validateTransaction(id, createdDate){
    const sql = `SELECT * FROM trpenjualan WHERE jul_sal_id = '${id}' AND jul_tanggaljual < '${createdDate}'`
    const result = await db.query(sql)
    return result
}

async function updateSales(id,Sales){
    const sql = `UPDATE mssalesman SET sal_nm = '${Sales.nama}', sal_kta_id = '${Sales.kota}' WHERE sal_id = '${id}'`
    const result = await db.query(sql)

    let message = 'Error in Updating Sales Data'

    if (result.affectedRows){
        message = 'Sales Data was successfully Updated'
    }
    return {message}
}

async function checkSell(id){
    const sql = `SELECT * FROM trpenjualan WHERE jul_sal_id = '${id}'`
    const result = await db.query(sql)
    return result
}

async function deleteSales(id){
    const sql = `DELETE FROM mssalesman WHERE sal_id = '${id}'`
    const result = await db.query(sql)
    let message = 'Error In Deleting Data'

    if (result.affectedRows > 0) {
        message = 'Sales record deleted successfully'
      } else {
        message = 'Sales record not found' 
      }
    return {message}
}

module.exports = {
    getAll,
    getSalesId,
    checkNama,
    checkKota,
    GenerateSalesId,
    createSales,
    checkSalesDate,
    validateTransaction,
    updateSales,
    checkSell,
    deleteSales,

}