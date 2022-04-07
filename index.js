const express = require('express');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 2000;
const HOST = process.env.HOST || 'localhost';

//Importing Routes
const userRoutes = require('./routes/userRoutes')

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());

//Routes
app.use(userRoutes);

app.listen(PORT, () => console.log(`Estamos yuk pt2 en http://${HOST}:${PORT}`))