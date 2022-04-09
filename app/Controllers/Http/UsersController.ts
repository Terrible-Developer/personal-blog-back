// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from '@adonisjs/http-server/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
    public async showAll() {
        const user = User.all()
        return user
    }

    public async show(request: HttpContext) {
        const user = await User.find(request.params.id)
        return user
    }

    public async showByUsername(request: HttpContext) {
        const user = await User.findBy('username', request.params.username)
        return user
    }

    public async create(request: HttpContext) {
        const params = request.request.requestBody
        const userId = await User.create({ username: params.username, password: params.password, email: params.email, isAdmin: params.is_admin })
        return userId
    }

    public async edit(request: HttpContext) {
        const params: Parameters<string> = request.request.requestBody
        const user: User = await User.find(request.params.id)
        user.username = params.username ? params.username : user.username
        user.password =  params.password ? params.password : user.password
        user.email =  params.email ? params.email : user.email

        const result = await user.save()

        return result

    }

    public async destroy(request: HttpContext) {
        const user = await User.find(request.params.id)
        await user?.delete().then(() => {
            return {
                "Success": "User " + user.username + "successfully deleted!"
            }
        }).catch(e => {
            console.log(e)
            return e
        })
    }
}
