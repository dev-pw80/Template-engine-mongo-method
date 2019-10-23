require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');

const path = require('path');
const Aqmpoint = require('./Aqmpoints');
const aqmData = require('./out3.json');


mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views')) //setting views directory for views
app.set('view engine', 'hbs') //setting view engine as handlebars

(async () => {
    await Aqmpoint.deleteMany();
    await Aqmpoint.insertMany(aqmData);
  })()


app.get('/', async (req, res) => {
    let aqmList = await Aqmpoint.find({
        'aqm.noxevent': {
            $gte: 50
        }
    });

    res.render('index', {
        air: aqmList
    });
})
app.listen(3000);
