const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function getAllPosts(req, res) {
    try{
        const posts = await prisma.post.findMany()
        res.status(200).json(posts)
    }
    catch (e) {
     res.status(500).json({message: e})
    }
}

async function getPost(req, res) {
    const { id } = req.query;
    try{
        const post = await prisma.post.findUnique({
            where: {id: id}
        })
        if(post){
            res.status(200).json(post)
        } else {
            res.status(404).json({message: "Post not found"})
        }
    }
    catch (e){
        res.status(500).json({message: e})
    }
}

async function createPost(req, res) {
    const { title, content } = req.body
    try{
        const newPost = await prisma.post.create({
            data: {
                title,
                content
            }
        })
        res.status(201).json(newPost)
    }
    catch (e){
        res.status(500).json({message: e})
    }
}

async function updatePost(req, res){
    const { id, title, content } = req.body
    try{
        const updatedPost = await prisma.post.update({
            where: {id: id},
            data: {
                title,content
            }
        })
        res.status(201).json(updatedPost)
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

async function deletePost(req, res){
    const { id } = req.body
    try{
        await prisma.post.delete({
            where: {id: id}
        })
        res.status(204).end()
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}