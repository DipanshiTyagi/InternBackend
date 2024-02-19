const express = require('express')
const { db } = require('./db/db')
const Coolie = require('./models/coolie');

const app = express()
require('dotenv').config()

const PORT = process.env.PORT

app.use(express.json());

const server = async() => {
    await db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    });

}
server();


app.post('/coolie', async (req, res) => {
    try {
        const coolieData = req.body;
        const newCoolie = new Coolie({ data: coolieData });
        await newCoolie.save();
        res.status(201).json({ message: 'Coolie data saved successfully' });
    } catch (error) {
        console.error('Error saving coolie data:', error);
        res.status(500).json({ error: 'Failed to save coolie data' });
    }
});
