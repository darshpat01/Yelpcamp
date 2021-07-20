const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
require('dotenv/config');

mongoose.connect(process.env.db_connection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random()*20) +10;  

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 8; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '60f08a81ce735a5388503ca8',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            price,
            geometry: {
                type: 'Point' ,
                coordinates: [ 139.7263785, 35.6652065 ]
            },
            images:
            [
                {
                  
                  url: 'https://res.cloudinary.com/drqgrp2xu/image/upload/v1626701888/Yelpcamp/egqvdu8md5dydsdccnix.jpg',
                  filename: 'Yelpcamp/egqvdu8md5dydsdccnix'
                },
                {
                  
                  url: 'https://res.cloudinary.com/drqgrp2xu/image/upload/v1626701888/Yelpcamp/qx5d1kkpp5xczru2dleu.jpg',
                  filename: 'Yelpcamp/qx5d1kkpp5xczru2dleu'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});