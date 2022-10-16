import {body} from "express-validator";

export const postCreateValidation = [ // валидация
    body('title', "Введите заголовок").isLength({min: 3}).isString(),
    body('text',"Введите текст").isLength({min: 4}).isString(),
    body('tags',"Неверный формат тэгов").optional().isArray(),
    body('imageUrl', "Неверная ссылка изображения").optional().isString()
]
