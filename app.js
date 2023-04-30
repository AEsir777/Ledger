import express from "express";
import authRouter from "./routes/auth.js";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use('/', authRouter);


app.listen(3000 || process.env.port, function() {
    console.log("Server is running on port 3000.");
});