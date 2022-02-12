// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from '@adonisjs/http-server/build/standalone'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class UsersController {
    public async showAll() {
        const user = User.all()
        return user
    }

    public async show(request: HttpContext) {
        const user = await User.find(request.params.id)
        console.log(request.params.id)
        return user
    }

    public async create(request: HttpContext) {
        const params = request.request.requestBody
        const userId = await Database
            .table('users')
            .insert({
                username: params.username,
                password: params.password,
                email: params.email,
            })
            .returning('id')
        return userId
    }

    public async delete(request: HttpContext) {
        const user = await User.find(request.params.id)
        await user?.delete().then(() => {
            //return 'User ' + user.username + 'successfully deleted!'
            return {
                "Success": "User " + user.username + "successfully deleted!"
            }
        }).catch(e => {
            return e
        })
    }
}
