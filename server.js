//export NODE_ENV=production // on production env...
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser'); // Import the body-parser middleware
const path = require('path')
const app = express();
const PORT = process.env.PORT || 4462;

// loggers
const morgan = require('morgan')
app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, 'public')));

// Add the body-parser middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route to handle weather data requests
app.get('/', async (req, res) => {
  try {
    res.status(200).render('home')
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Use a POST request handler to handle form submissions
app.post('/',async (req, res) => {
  try{
    const myInputValue = req.body.myInput;
    // Make an HTTP request to the weather service API  countruoutput
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${myInputValue}&APPID=${process.env.WEATHER_API_KEY}`);
    // Extract the relevant weather data
    const data = response.data;
    const weather = {
      location: `${data.name}, ${data.sys.country}`,
      temperature: data.main.temp,
      description: data.weather[0].description
    }
    res.render('weatherTemplate',{
      location:`${weather.location}`,
      temperature:`${weather.temperature}`,
      description:`${weather.description}`,
    })
    console.table(weather)
  }catch(err){
    // res.status(500).send(`Internal Server Error`)
    // res.sendStatus(500)
    res.render('home',{
      error:`Invalid Input`
    })
    console.error(err.message)
  }
})

// 404 not found !.
app.use((req,res)=>{
  res.status(200).render('404',{
    notfound:"404 Not Found !."
  })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



