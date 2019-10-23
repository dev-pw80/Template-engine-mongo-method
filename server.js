require('dotenv').config();
const app = require('express')();


const mongoose = require('mongoose');
var path = require('path');
const Aqmpoint = require('./models/Aqmpoints');
const User = require('./models/User');
const userData = [{ email: "admin@example.com" }, { email: "user@example.com" }];
const aqmData = require('./out3.json');
mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

(async () => {
    await Aqmpoint.deleteMany();
    await User.deleteMany();
    const createdUser = await User.insertMany(userData);

    for (elem of aqmData) {
        elem.user = createdUser[Math.floor(Math.random()* createdUser.length)]._id
        console.log(elem)
    }
    await Aqmpoint.insertMany(aqmData);
})()

app.get("/:userId?", async (req, res) => {
    const query = req.params.userId ? {user: req.params.userId} : {}
    let aqmpoints = await Aqmpoint.find(query).populate('user');
    let users = await User.find();
    res.render("index", { aqmpoints, users });
  });

app.listen(3000);