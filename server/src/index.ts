import express from "express";
const app = express();

import dotenv from "dotenv"

dotenv.config()



app.listen(process.env.PORT as string || "3000", () => {
    console.log("Server running on port 3000");
})