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
        console.log(request.params.id)
        return user
    }

    public async create(request: HttpContext) {
        const params = request.request.requestBody
        const userId = await User.create({ username: params.username, password: params.password, email: params.email, isAdmin: params.is_admin })
        return userId
    }

    public async destroy(request: HttpContext) {
        const user = await User.find(request.params.id)
        console.log('Trying to delete user ' + user?.id)
        await user?.delete().then(() => {
            console.log('worked?')
            //return 'User ' + user.username + 'successfully deleted!'
            return {
                "Success": "User " + user.username + "successfully deleted!"
            }
        }).catch(e => {
            console.log(e)
            return e
        })
    }
}
