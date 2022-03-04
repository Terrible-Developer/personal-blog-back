import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {

    /*public async showRegister({ view }: HttpContextContract) {
        return view.render('auth/register')
    }*/

    public async register({ request, response, auth }: HttpContextContract) {
        //return response.send('you tried to register a new user!')
        const userSchema = schema.create({
            username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
            email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'email', caseInsensitive: true })]),
            password: schema.string({}, [rules.minLength(8)])
        })

        const data = await request.validate({ schema: userSchema })

        try{
            const user = await User.create(data)

            await auth.login(user)

            return this.login({ request, response, auth })
        } catch(e) {
            return response.status(e.status | 500).send(e)
        }

        return response
    }


    /*public async showLogin({ view }: HttpContextContract) {
        return view.render('auth/login')
    }*/

    public async login({ request, response, auth }: HttpContextContract) {
        //return response.send('you tried to login as an user!')
        const { uid, password } = request.only(['uid', 'password'])
        console.log('TEST: ' + uid + ' ' + password)

        try {
            const token = await auth.use('api').attempt(uid, password)
            return token
        } catch(e) {
            console.log(e)
            return response.status(e.status | 500).send(e)
        }
    }
}
