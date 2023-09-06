import express from 'express';
import{
    getAllArtID
} from "./database.js"
import cors from "cors";

const corsOption = {
    origin: "http://192.168.1.187:8080",
    methods: ["POST","GET"],
    credentials: true,
}

const app = express();
app.use(express.json());
app.use(cors(corsOption));

app.get("/all", async (req, res) =>{
    const  all = await getAllArtID();
    res.status(200).send(all);
})

app.listen(8080, () => {
    console.log("Server Running at port 8080");
});