import express from 'express';
import multer from 'multer';
import { storage } from './config/multer.js';
import { connectDB } from './config/db.js';
const app = express();
const port = 3000;


await connectDB(); // Connect to MongoDB

//Working with database
app.post('/person', express.json(), (req ,res) => {
    console.log(req.body);
    res.send('Person data received!');
})









//working with form-data using multer third-party library
const upload = multer({ storage: storage ,
    limits : {
        fileSize : 1024 * 1024 * 5 //5mb
    }
});
 
// Built-in Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(upload.single('image'));

app.post('/form',  (req, res) => {
    console.log(req.body);
    console.log(req.file); // This will log the file buffer and metadata
    res.send('Form submitted successfully!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})







