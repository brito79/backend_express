import express from 'express';
import multer from 'multer';


const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '_' +Date.now() + file.originalname);
    }
})

const app = express();
const port = 3000;
const upload = multer({ storage: storage ,
    limits : {
        fileSize : 1024 * 1024 * 5 //5mb
    }
});
 
//set ejs as default view engine
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







