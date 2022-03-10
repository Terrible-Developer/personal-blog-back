// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from '@adonisjs/http-server/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import Post from 'App/Models/Post'
import User from 'App/Models/User';
import PostLike from 'App/Models/PostLike'

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

    public async likePost({ params, auth }){
        await auth.use('api').authenticate()
        const user: User = await auth.use('api').user!

        let returnValue: boolean
        let existsLikes = await this.hasUserLikedPost({params, auth})

        if(!existsLikes){
            this.addLike(user.id.toString(), params.id)
            returnValue = true
        }
        else{
            this.removeLike(user.id.toString(), params.id)
            returnValue = false
        }

        return returnValue

    }

    public async hasUserLikedPost({ params, auth }){
        await auth.use('api').authenticate()
        const user: User = await auth.use('api').user!
        const postId = params.id


        const hasLiked = await Database
            .query()
            .from('posts_like_users')
            .where('userid', '=', user.id)
            .andWhere('postid', '=', postId)
        const count = Object.keys(hasLiked).length
        if(count > 0){
            return true
        }
        return false
    }

    private async addLike(userId: string, postId: string){
        const postLike: PostLike = await PostLike.create({
            postId: postId,
            userId: userId
        })
        return 'success'
    }

    private async removeLike(userId: string, postId: string){
        const dbResponse = await Database
            .query()
            .delete()
            .from('posts_like_users')
            .where('userid', userId)
            .andWhere('postid', postId)
        return dbResponse
    }
}
