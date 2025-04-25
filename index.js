import express from 'express';
import multer from 'multer';
import { storage } from './config/multer.js';
import { connectDB } from './config/db.js';
import { Person } from './models/Person.js';
import cookieParser from 'cookie-parser';
import session  from 'express-session';
import e from 'express';



const app = express();
const port = 3000;

//MIDDLEWARE FOR COOKIES
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(session({
    secret : 'secret-key',
    resave : false,
    saveUninitialized : false,
    cookie : { secure : false } // Set to true if using HTTPS
}))


//AUTHENTICATION AND VERIFICATION
const users = [];

app.post('/register',async (req, res) => {
    const {username, password} = req.body;
    users.push({username,
         password});
         res.send('User registered!');
})
 

app.get('/login' , async (req, res) => {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username);
    if (!user || password !== user.password) {
        return res.send('Not authorised!');
    }
    req.session.user = user; // Store user in session
    res.send('Logged in!');

})

app.get('/dashboard', async (req, res) => {
    if (!req.session.user) {
        return res.send('Not registered!');
    }
    res.send(`Welcome to the dashboard, ${req.session.user.username}!`);
})













// app.get('/' , (req, res) => {
//     res.cookie('name', 'express-app', {maxAge : 360000}); // Set a cookie
//     res.send('Cookie set!');
// })



//when  ever we visit the site it will count times we visit the site
app.get('/visit', (req, res) => {
     if (req.session.page_views) {
        req.session.page_views++;
        res.send(`You visited this page ${req.session.page_views} times`); 
     }  else {
        req.session.page_views = 1;
        res.send('Welcome to the site for the first time!');
     }
})
//removing all the data of cookies in the backend
app.get('/clear-session', (req, res) => {
    req.session.destroy();
    res.send('Session cleared!');
})


app.get('/fetch' , (req, res) => {
    console.log('Cookies: ', req.cookies); // Access cookies
    res.send('Cookies received!');
})

app.get('/remove-cookie' , (req, res) => {
    res.clearCookie('name'); // Clear a cookie
    res.send('Cookie removed!');
})










//await connectDB(); // Connect to MongoDB
app.use(express.json()); // Middleware to parse JSON bodies

//Working with database
app.post('/person', express.json(), async (req ,res) => {
    try {
        const {email, name, age} = req.body;
        const newPerson = new Person({
            name,
            age,
            email
        })
        await newPerson.save();
        console.log('Person data saved:', newPerson);
        res.send('Person data received!');
} catch (error) {
        res.send(error.message);
    }
});
    

//UPDATING DATA IN MONGODB
app.put('/person', async (req, res) => {
    const {id} = req.body;
    const findUser = await Person.findByIdAndUpdate(id, {age : 34});
    console.log(findUser);
    

    res.send("User found");
} )

//DELETING DATA IN MONGODB
app.delete('/person/:id' , async (req, res) => {
    const {id} = req.params;
    await Person.findByIdAndDelete(id);
    res.send('User deleted!')
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







