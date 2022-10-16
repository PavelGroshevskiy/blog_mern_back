import {body} from "express-validator";

export const loginValidation = [ // валидация
    body('email', "Неверный емайл").isEmail(),
    body('password',"Длина пароля менее 5 символов").isLength({min: 5})
]

export const registerValidation = [ // валидация
    body('email', "Неверный емайл").isEmail(),
    body('password',"Длина пароля менее 5 символов").isLength({min: 5}),
    body('fullName',"Длина имени пользователя менее 3 символов").isLength({min: 3}),
    body('avatarUrl', "Неверная ссылка на аватарку").optional().isURL()

]
