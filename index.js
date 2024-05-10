const express = require("express");
const mongoose = require("mongoose");
const contactRouter = require("./routes/contactRoute");

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://pawan:pawan123456@cluster0.cwaavvs.mongodb.net/user-database")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", contactRouter);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
