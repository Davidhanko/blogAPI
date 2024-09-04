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
    const userId = req.user.id
    if (!title || !content || !userId) {
        return res.status(400).json({ message: "Title, content, and userId are required" });
    }
    try{
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: userId
            }
        })
        res.status(201).json(newPost)
    }
    catch (e){
        res.status(500).json({message: e})
    }
}

async function updatePost(req, res){
    const { id, title, content} = req.body
    try{
        const post = await prisma.post.findUnique({
            where: {id}
        })

        if (!post){
            return res.status(404).json({message: "Post not found"})
        }

        if (post.authorId !== userId){
            return res.status(403).json({message: "You are not authorized to edit this post"})
        }
        const updatedPost = await prisma.post.update({
            where: {id},
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

async function deletePost(req, res) {
    const { id } = req.body;
    const userId = req.user.id; // Extracted from JWT payload

    try {
        const post = await prisma.post.findUnique({
            where: { id: id }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.authorId !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        await prisma.post.delete({
            where: { id: id }
        });

        res.status(204).end();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
}