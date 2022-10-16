import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        // хэшируем пароль
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)

        // создаем нового юзера
        const doc = new User({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        // сохранение пользователя
        const user = await doc.save()

        // создаем токен
        const token = jwt.sign(
            {_id: user._id},
            'secret',
            {expiresIn: '30d'} //  валидност токена
        )
        const {passwordHash, ...userData} = user._doc // вытащили пасворд жэш из данных
        //валидация пройдена - ответ
        res.json({...userData, token})
    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req,res) => {
    try{
        const user = await User.findOne({
            email: req.body.email
        })
        if(!user) {
            return res.status(404).json({
                message: 'Пользлватель не найден'
            })}
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }
        const token = jwt.sign(
            {_id: user._id},
            'secret',
            {expiresIn: '30d'} //  валидност токена
        )
        const {passwordHash, ...userData} = user._doc // вытащили пасворд жэш из данных
        res.json({...userData, token})
    }
    catch (e) {
        console.log(e)
        res.status(404).json({
            message: 'Не удалось авторизоваться '
        })
    }
}

export const getMe = async (req, res)=>{
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            res.status(403).json({
                message: "Пользователь не найден"
            })
        }
        const {passwordHash, ...userData} = user._doc // вытащили пасворд жэш из данных
        //валидация пройдена - ответ
        res.json({...userData})
    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}