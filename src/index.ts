import  express  from "express";
import { Request, Response } from "express";
import cors from "cors"
import CategoryRoutes from "./routes/category"
import SubCategoryRoutes from "./routes/subCategory"
import ItemRoutes from "./routes/item"
import dotenv from "dotenv"

const app = express();
app.use(cors())
app.use(express.json())
dotenv.config();

app.get('/',(req : Request, res : Response)=>{
    res.json("Hello world")
})

app.use('/category',CategoryRoutes);

app.use('/subCategory',SubCategoryRoutes);

app.use('/item',ItemRoutes);

app.listen("3000",()=>{
    console.log("App is listening on port 3000")
})