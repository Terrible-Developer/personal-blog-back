// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from '@adonisjs/http-server/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'

export default class PostsController {
    public async showAll() {
        const posts = await Post.all()
        return posts
    }

    public async showAllByUserId(request: HttpContext) {
        const posts = await Post.query().where('userid', request.params.userId)
        return posts
    }

    /*public async getFilteredPosts(request: HttpContext) {

    }*/

    public async show(request: HttpContext) {
        const post = await Post.find(request.params.id)
        return post
    }

    public async create(request: HttpContext) {
        const params = request.request.requestBody
        const postId = await Database
            .table('posts')
            .insert({
                title: params.title,
                content: params.content,
                userid: params.userid
            })
            .returning('id')
        return postId
    }

    public async delete(request: HttpContext) {
        const post = await Post.find(request.params.id)
        await post?.delete().then(() => {
            return 'Post ' + post.id + 'successefuly deleted!'
        }).catch(e => {
            return e
        })

    }
}
