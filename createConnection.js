import { MongoClient } from "mongodb";
import * as dotenv from "dotenv"
dotenv.config()
const url = process.env.Url
export async function createConnection() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log("mongodb connected");
        return client;
    } catch (err) {
        console.log("some error occured while connecting to database", err);
    }

}

export const client = await createConnection()