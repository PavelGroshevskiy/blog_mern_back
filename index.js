import express from 'express'
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors'

import {loginValidation, registerValidation} from './validation/auth.js'
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {postCreateValidation} from "./validation/post.js";
import {PostController, UserController} from "./controllers/index.js";


mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.no1co.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('DB is OK')
})
    .catch((err)=>console.log('DB error', err))

const app = express()

//создаем хранилище
const storage = multer.diskStorage(
    {
        //функция какой путь использовать
        destination:(__, _, cb) => {
            cb(null, 'uploads')
        },
        // название файла
        filename: (__, file, cb) => {
            cb(null, file.originalname)
        },
    })

// применяем логику на экспресс
const upload = multer({storage})

app.use(express.json( ))
app.use(cors())
app.use('/uploads', express.static('uploads',{}))

app.get('/', (req, res) => {
    res.send('Hello')
})

// Login
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

 // Registration
app.post('/auth/register', registerValidation, handleValidationErrors , UserController.register)

//
app.get('/auth/me', checkAuth, UserController.getMe)

// Upload route
app.post('/uploads', checkAuth, upload.single('image'), (req,res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})
app.get('/tags', PostController.getLastTags)

//  CRUD Post
app.get('/posts', PostController.getAll)
// app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth ,postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id',checkAuth, handleValidationErrors,PostController.update)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    {console.log('Server OK')}
} )