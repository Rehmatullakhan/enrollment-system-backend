import express from 'express';
import cors from 'cors';
import { connection, courseCollection, studentCollection } from './dbconfig.js';
import { ObjectId } from 'mongodb';


const app = express();
app.use(express.json());
app.use(cors({
    origin:["https://enrollment-system-red.vercel.app", "https://localhost:5173"]
}));

let db;
connection().then(database => {
    db = database;
    console.log("Connected to DB: enrollment_db");
}).catch(err => console.log(err));

   app.get('/api/students/:id/courses', async (req, res) => {
      const studentId = req.params.id;
      const myCourses = await db.collection("courses").find({ enrolledStudents: studentId }).toArray();
      res.json(myCourses);
    });

// 1. Get all courses
app.get('/api/courses', async (req, res) => {
    try {
         const courses = await db.collection("courses").find().toArray();
  res.json(courses);
    } catch (error) {
      console.log("error in /api/courses",error);
      res.status(500).json({message:"server error"});  
    }
 
});

// 2. Enroll student
app.post('/api/enroll', async (req, res) => {
  const { studentId, courseId } = req.body;
  const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) });

  if(course.enrolledStudents.includes(studentId))
    return res.status(400).json({msg: "Already enrolled"});
  
  if(course.enrolledStudents.length >= course.capacity)
    return res.status(400).json({msg: "Course is full"});

  await db.collection("courses").updateOne(
    { _id: new ObjectId(courseId) },
    { $push: { enrolledStudents: studentId } } // bracket fix
  );
  res.json({msg: "Enrolled Successfully"});
});

// 3. Unenroll student
app.post('/api/unenroll', async (req, res) => {
  const { studentId, courseId } = req.body;
  await db.collection("courses").updateOne(
    { _id: new ObjectId(courseId) },
    { $pull: { enrolledStudents: studentId } } // bracket fix
  );
  res.json({msg: "Unenrolled Successfully"});
});

// 4. Get student's courses
app.get('/api/students/:id/courses', async (req, res) => {
  const studentId = req.params.id;
  const myCourses = await db.collection("courses").find({ enrolledStudents: studentId }).toArray();
  res.json(myCourses);
});

// 5. Add course - Admin
app.post('/api/courses', async (req, res) => {
  const { title, description, capacity } = req.body;
  await db.collection("courses").insertOne({ title, description, capacity: Number(capacity), enrolledStudents: [] });
  res.json({msg: "Course Added"});
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
