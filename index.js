const express = require('express');
const app = express();
const port = 3000
const bodyParser = require('body-parser')
const salesRoute = require('./routes/SalesRoutes')


//use
app.use(bodyParser.json())
//routes

app.use('/api/sales', salesRoute)

  


app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})