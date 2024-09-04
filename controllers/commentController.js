const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function getComments(req, res){
    const { postId } = req.params

    try{
        const comments = await prisma.comment.findMany({
            where: {postId}
        })

        if(comments.length > 0){
            res.status(200).json(comments)
        } else res.status(404).json({message: "No comments found"})
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

async function createComment(req, res){
    const { postId } = req.params
    const userId = req.user.id; // Extracted from JWT payload
    const content = req.body

    try{
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                userId
            }
        })
        res.status(201).json(newComment)
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

async function replyComment(req, res){
    const { postId, commentId } = req.params
    const content = req.body
    const userId = req.user.id

    try{
        const newComment = await prisma.comment.create({
            data: {
                content,
                postId,
                commentId,
                userId
            }
        })

        res.status(201).json(newComment)
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

async function editComment(req, res){
    const { content, id } = req.body
    const userId = req.user.id

    try{
        const comment = await prisma.comment.findUnique({
            where: {id}
        })

        if(!comment){
            return res.status(404).json({message: "Comment not found"})
        }

        if(comment.authorId !== userId){
            return res.status(403).json({message: "You are not authorized to edit this comment"})
        }

        const updatedComment = await prisma.comment.update({
            where: {id},
            data: {content}
        })

        res.status(200).json(updatedComment)
    }
    catch (e) {
        res.status(500).json({message: e})
    }
}

async function deleteComment(req, res) {
    const { id } = req.body;
    const userId = req.user.id; // Extracted from JWT payload

    try {
        const comment = await prisma.comment.findUnique({
            where: { id }
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.authorId !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await prisma.comment.delete({
            where: { id }
        });

        res.status(204).end();
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    getComments,
    createComment,
    replyComment,
    editComment,
    deleteComment
}