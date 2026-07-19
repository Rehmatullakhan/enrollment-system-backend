import { MongoClient } from "mongodb";

// ⚠️ CHANGE PASSWORD IN ATLAS ASAP - IT'S VISIBLE IN YOUR SCREENSHOT
const url = "mongodb+srv://rehmatullahkhan37_db_user:Guru26@cluster0.mhdz7ht.mongodb.net/?retryWrites=true&w=majority";

const dbName = "enrollment_db"; // New DB for this project
export const courseCollection = "courses";
export const studentCollection = "students";

const client = new MongoClient(url);
export const connection = async () => {
    const connect = await client.connect();
    return connect.db(dbName);
}