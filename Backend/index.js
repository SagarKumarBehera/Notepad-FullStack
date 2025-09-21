const express = require('express')
const cors = require('cors')
const {connection,PORT} = require('./Config/db')
const noteController = require('./Controllers/notecontroller')
const userController = require('./Controllers/usercontroller')
const authorization = require('./Middleware/authorization')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.send({msg:"API Running!!"})
})

app.use('/user',userController)
app.use(authorization)
app.use('/note',noteController)

app.listen(PORT, async ()=>{
    try {
        await connection;
        console.log('Connected to DataBase')
    } catch (error) {
        console.log(`${error} is giving while connecting`)
    }
    console.log(`Listening on PORT: ${PORT}`)
})