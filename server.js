const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use(express.static('website'));

const port = 8080;
app.listen(port, () => {
  console.log(`running on localhost: ${port}`);
});

// const projectData = [];

// Routes