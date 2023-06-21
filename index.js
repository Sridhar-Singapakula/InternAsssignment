const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv')
const bodyParser = require('body-parser');
const dbConnect = require('./db')
const clientRoutes=require("./routes/client")
const authRoutes=require("./routes/clientAuth")
const taskRoutes = require("./routes/task")

dotenv.config();
dbConnect();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/clients",clientRoutes);
app.use("/api/login",authRoutes);
app.use("/api/task",taskRoutes);


const signal = process.env.PORT || 8080;
app.listen(signal,()=>{
    console.log(`Listening to ${signal}..`);
})