const express = require('express');
const app = express();
const cors = require('cors')

const PORT = process.env.PORT || 2000;
const HOST = process.env.HOST || 'localhost';

//Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());

app.listen(PORT, () => console.log(`Estamos yuk pt2 en http://${HOST}:${PORT}`))