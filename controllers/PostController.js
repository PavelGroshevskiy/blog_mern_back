import {validationResult} from "express-validator";
import Post from "../models/post.js";

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec() // получение всех постов + вытащили юзера
        res.json(posts);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec()
        const tags = posts.map((obj) => obj.tags).flat().slice(0,5)
        res.json(tags);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось получить тэги'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id

        Post.findOneAndUpdate(
            {_id: postId},
            {$inc:{viewsCount: 1}}, // увеличиваем viewsCount на 1
            {returnDocument:'after'}, // после обновлия получаем данные
            (err, doc) => {
                if(err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'Не удалось вернуть  статью'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }
                res.json(doc)
            }
        ).populate('user')
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const create = async (req,res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            user: req.userId,
            imageUrl: req.body.imageUrl
        })

        const post = await doc.save()

        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const remove = async (req,res) => {
    try {
        const postId = req.params.id
        Post.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }

            if(!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }
            res.json({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
}
}

export const update = async (req,res) => {
    try {
       const postId = req.params.id
        await Post.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                user: req.userId,
                imageUrl: req.body.imageUrl
            }
        )

        res.json({
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}