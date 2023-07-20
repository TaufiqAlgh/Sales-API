const db = require ('../connection')
const response = require ('../response')

const getAllSales =  (req,res) => {
    const sql = `SELECT * FROM mssalesman`
    db.query(sql, (err, result) => {
        if (err) response(500, "Invalid", "Server Error", res)
        response (200, result, "Menampilkan Data Seluruh Sales", res)
    })
}

const getSalesById = (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM mssalesman WHERE sal_id = '${id}'`
    db.query(sql, (err, result) => {
        if (err) response(500, "Invalid", "Server Error", res)
        response (200, result, "Menampilkan Data Sales Berdasarkan Sales Id", res)
    })
}
const createSales = (req, res) => {
    const { nama, kota } = req.body;
  
    // Validation: Check if nama is unique
    const checkNamaQuery = `SELECT * FROM mssalesman WHERE sal_nm = '${nama}'`;
    db.query(checkNamaQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (result.length > 0) {
        res.status(400).json({ error: 'Nama sales already exists' });
        return;
      }
  
      // Validation: Check if kota exists in the master kota table
      const checkKotaQuery = `SELECT * FROM mskota WHERE kta_id = '${kota}'`;
      db.query(checkKotaQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Server error' });
          return;
        }
  
        if (result.length === 0) {
          res.status(400).json({ error: 'Invalid kota' });
          return;
        }
  
        // Generate kode sales
        const generateKodeQuery = `SELECT sal_id FROM mssalesman ORDER BY sal_id DESC LIMIT 1`;
        db.query(generateKodeQuery, (err, result) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Server error' });
            return;
          }
  
          let nextKode = 'S001';
          if (result.length > 0) {
            const lastKode = result[0].sal_id;
            const lastNumber = parseInt(lastKode.substr(1));
            nextKode = `S${(lastNumber + 1).toString().padStart(3, '0')}`;
          }
  
          // Insert new sales record into the database
          const insertQuery = `INSERT INTO mssalesman (sal_id, sal_nm, sal_bekerjasejak, sal_kta_id) VALUES ('${nextKode}', '${nama}', CURDATE(), '${kota}')`;
          db.query(insertQuery, (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).json({ error: 'Server error' });
              return;
            }
  
            res.json({ success: true, message: 'Sales created successfully' });
          });
        });
      });
    });
}
const updateSales =  function (req, res) {
    const {id} = req.params
    const {nama , kota } = req.body

    const checkNamaQuery = `SELECT * FROM mssalesman WHERE sal_nm = '${nama}'`;
    db.query(checkNamaQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (result.length > 0) {
        res.status(400).json({ error: 'Nama sales already exists' });
        return;
      }

      const checkKotaQuery = `SELECT * FROM mskota WHERE kta_id = '${kota}'`;
      db.query(checkKotaQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Server error' });
          return;
        }
  
        if (result.length === 0) {
          res.status(400).json({ error: 'Invalid kota' });
          return;
        }

              // Validation: Check if there are any sales records with the specified sal_id
      const checkSalesQuery = `SELECT * FROM mssalesman WHERE sal_id = '${id}'`;
      db.query(checkSalesQuery, (err, result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        
        if (result.length === 0) {
          res.status(400).json({ error: 'Sales record not found' });
          return;
        }
        
        // validation check tanggal pembuatan sales
        const checkSalesDateQuery = `SELECT * FROM mssalesman WHERE sal_id = '${id}'`
        db.query(checkSalesDateQuery, (err, result) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          if (result.length == 0){
            res.status(400).json({ error: 'Sales record not found' });
            return;
          }
           const createdate = result[0].sal_bekerjasejak
          
          
          // Validation: Check if there are any sales transactions with tanggal_penjualan earlier than the new date
          const checkTransactionQuery = `SELECT * FROM trpenjualan WHERE jul_sal_id = '${id}' AND jul_tanggaljual < '${createdate}'`;
          db.query(checkTransactionQuery, (err, result) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).json({ error: 'Server error' });
              return;
            }
            
            if (result.length > 0) {
              res.status(400).json({ error: 'Cannot update. There are sales transactions with dates earlier than the specified date' });
              return;
            }

            // Update the sales record in the database
            const updateQuery = `UPDATE mssalesman SET sal_nm = '${nama}', sal_kta_id = '${kota}' WHERE sal_id = '${id}'`;
            db.query(updateQuery, (err, result) => {
              if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              
              res.json({ success: true, message: 'Sales record updated successfully' });

              })
            });
          })
        })
      })
    })
}
const deleteSales = (req, res) => {
    const {id} = req.params
  
    const CheckSellQuery = `SELECT * FROM trpenjualan WHERE jul_sal_id = '${id}'`
    db.query (CheckSellQuery, (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (result.length > 0) {
        res.status(400).json({ error: 'Cannot Delete. There are sales transactions that have done by this sales' });
        return;
      }
  
      // delete query
      const deletequery = `DELETE FROM mssalesman WHERE sal_id = '${id}'`
      db.query (deletequery, (err,result) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        if (result.affectedRows > 0) {
          res.json({ success: true, message: 'Sales record deleted successfully' });
        } else {
          res.status(400).json({ error: 'Sales record not found' })
        }
      })
    })
  }
module.exports = {
    getAllSales,
    getSalesById,
    createSales,
    updateSales,
    deleteSales
}