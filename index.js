const express = require('express'); // Import the express library
const app = express(); // Create an Express application instance
const path = require('path'); // Define the port number
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./middleware/dbConnection.js');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT  = process.env.PORT;

connectDB();
const whitelist = ['http://localhost:8080','http://localhost:3000', 'https://www.myauthorizedfrontend.com', 'https://www.google.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) { // !origin allows non-browser clients and same-origin requests
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

// 3. Apply the CORS middleware globally with the options
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
// Always use static files above requests. Otherwise it'll give an error
app.use('/',express.static(path.join(__dirname, 'public')));
app.use('/subdir',express.static(path.join(__dirname, 'public')));
// Define a route for GET requests to the root URL ("/")

app.use('/subdir',require('./Dummy/subdir.js'));
app.use('/registration', require('./routes/apis/userRegistration.js'));
app.use('/auth', require('./routes/apis/userAuth.js'));
app.use('/refresh',require('./routes/apis/refreshTokenController.js'));
app.use('/api', require('./routes/apis/employees.js'));
app.use('/logout', require('./routes/apis/logout.js'));

app.use((err, req,res,next) => {
  res.status(500).send(err.message);
});

app.get(['/','/index','/index.html'], (req, res, next) => { // Send a response back to the client
  console.log(res.statusCode);
  next();
}, (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'index.html'));
});

app.get('/*splat',(req,res) => {
  res.status(404).send('Error: 404. Page not found');
});

// Start the server and listen on the specified port

mongoose.connection.once('open', () => {
  console.log("Successfully connected to DB");
  app.listen(PORT, () => {console.log(`Server is running on http://localhost:${PORT}`)});
});

mongoose.connection.on('error', (err) => {
  console.error("Oops! MongoDB connection error:", err);
});