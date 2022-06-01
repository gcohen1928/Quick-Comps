const express = require('express')
cors = require("cors");
const app = express();
app.use('*', cors());

const writeCSV = require('./scanner')

//writeCSV('https://www.apartments.com/arlington-tx-76010/', 'hello!')

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());


app.listen(8000, () => {
    console.log("ON PORT 8000");
})

//Creates header so it can make request
//Had to add this in because I kept getting an error message when receving get request
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     response.setHeader("Access-Control-Allow-Credentials", "true");
//     response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
//     response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, link");
//     next();
// })

//Defines get path and return billboards array
app.get('/api/scrape', async (req, res) => {
    const link = req.headers['link']
    try {
        const response = await writeCSV(link, 'any')
        if (response.length === 0) {
            res.status(204).send('No content available')
        } else {
            res.status(200).send(response)
        }
    } catch (err) {
        res.status(503).send('API Services Down')
    }
})