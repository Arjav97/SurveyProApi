import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app=express();
//https://medium.com/@colinrlly/send-store-and-show-images-with-react-express-and-mongodb-592bc38a9ed
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/survey', { useNewUrlParser: true , useFindAndModify: false , useUnifiedTopology: true},function(error){
   if(error) console.log(error);
});

var auth = require('./routes/auth');
var product = require('./routes/product');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads'))

app.use('/api/auth',auth)
app.use('/api/product',product)

const PORT = 5000
app.listen(PORT , () => {
    console.log(`Server running at ${PORT}`)
})