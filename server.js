import mongoose from "mongoose";
import { DB_HOST } from "./congif";
import { app } from "./app";

mongoose.set("strictQuery", true);
mongoose.connect(DB_HOST);
