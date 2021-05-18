const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb+srv://darshan:darshanp123@cluster0.6r0ou.mongodb.net/yelp-camp?retryWrites=true&w=majority', {
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
    for (let i = 0; i < 5; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})