const express = require ('express');
const {faker} = require("@faker-js/faker");
const path = require ("path");
const axios = require ('axios');
const app = express();


const port = 8080;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const uniqueImageParam = () => Math.floor(Math.random() * 1000);

const fetchImage = async() => {
    const randomImageNumber = uniqueImageParam();
    const imageUrl =  `https://xsgames.co/randomusers/avatar.php?g=male&i=${randomImageNumber}`;
    const response = await axios.get(imageUrl, {responseType : 'arraybuffer'});
    return Buffer.from(response.data, 'binary');

}

let getUser = async() => {
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
};


app.get('/', (req, res) => {
    res.send("hello world");
});

let getUsers = async (count) => {
    const userPromises = Array.from({ length: count }, () => getUser());;
    return await Promise.all(userPromises);
};

app.get ('/user', async(req, res) => {
    const data = await getUsers(25);
    res.render("data.ejs", {data});
});

console.log(getUser());

app.listen (port, () => {
    console.log(`Server listening to port ${port}`);
});
