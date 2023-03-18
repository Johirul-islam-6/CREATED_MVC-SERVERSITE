const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");
const toolsRoutes = require("./routes/v1/tools.route.js");
const errorHandler = require("./middleware/errorHandler");
const { connectToServer } = require("./utils/dbConnect");

// Middle wair
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// app.use(viewCount);

// Apply the rate limiting middleware to all requests
// app.use(limiter);

//MongoDB connection
connectToServer((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } else {
    console.log(err);
  }
});

// http://localhost:5000/api/v1/tools 
// routeing path
app.use("/api/v1/tools", toolsRoutes);

// just home page show this index file
app.get("/", (req, res) => {
  // res.send("Hello World");
  // res.sendFile(__dirname + "/public/test.html");
  res.render("home.ejs", {
    id: 5,
    user: {
      name: "test",
    },
  });
});

// If Never route founded
app.all("*", (req, res) => {
  res.send("NO route found.");
});

// Error Handler globaly
app.use(errorHandler);

// MongoDb Error Handeling 
process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
