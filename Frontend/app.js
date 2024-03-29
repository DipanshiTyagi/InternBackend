const express = require ('express');
const { faker } = require("@faker-js/faker");
const path = require ("path");
const axios = require ('axios');
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const PORT = 3000;

const uniqueImageParam = () => Math.floor(Math.random() * 1000);

const fetchImage = async() => {
    const randomImageNumber = uniqueImageParam();
    const imageUrl =  `https://xsgames.co/randomusers/avatar.php?g=male&i=${randomImageNumber}`;
    try {
        const response = await axios.get(imageUrl, {responseType : 'arraybuffer'});
        return Buffer.from(response.data, 'binary');
    } catch(error) {
        console.error('Error fetching image:', error);
        throw new Error('Failed to fetch image');
    }    

}

let getUser = async() => {
    try {
        const [image] = await Promise.all([fetchImage()]);

        return {
            image: `data:image/jpeg;base64,${image.toString('base64')}`,
            name: faker.person.fullName(),
            rating: faker.number.int({ min: 1, max: 10 }),
            badge_number: faker.number.int({min: 1, max:999}),
            phone: faker.phone.number(),
            noOfTrips: faker.number.int({ min: 1, max: 50 }),
            location: faker.location.streetAddress()
        };
    } catch(error) {
        console.error('Error generating user data:', error);
        throw new Error('Failed to generate user data');
    }
    
};


app.get('/', (req, res) => {
    res.send("hello world");
});

app.get('/coolie', async (req, res) => {
    try {
        const coolieData = await getUser();
        await axios.post('http://localhost:3030/coolie', coolieData);
        res.send('Coolie data sent to backend');
    } catch (error) {
        console.error('Error fetching coolie data:', error);
        res.status(500).json({ error: 'Failed to fetch coolie data' });
    }
}); 

let getUsers = async (count) => {
    const userPromises = Array.from({ length: count }, () => getUser());;
    return await Promise.all(userPromises);
};

app.get ('/user', async(req, res) => {
    try{
        const data = await getUsers(25);
        res.render("data.ejs", {data});
    } catch(error) {
        next(error);
    }
});

console.log(getUser());

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something crashed!');
});

app.listen(PORT, () => {
    console.log(`Frontend server listening at http://localhost:${PORT}`);
});
