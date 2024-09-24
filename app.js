const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("./utils");
require("dotenv").config();

const auth = require("./routes/auth");
const users = require("./routes/users");
const booking = require("./routes/booking");
const service = require("./routes/services");

const app = express();

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;
const URI = process.env.MONGO_DB_CONNECT_URI

mongoose
    .connect(URI)
    .then(() => console.log("SUCCESSFULLY CONNECTED"))
    .catch(error => console.log(error))

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/booking", booking);
app.use("/api/service", service);

app.listen(PORT, () => {
    console.log(PORT + " is being listended")
})