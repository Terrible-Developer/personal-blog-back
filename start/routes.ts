/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import User from 'App/Models/User'

/*Testing and miscelaneous routes*/

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/authadmin', async ({ auth }) => {
  await auth.use('api').authenticate()
  const user: User = await auth.use('api').user!
  return {
    isAdmin: user.isAdmin
  }
})

Route.get('/healthcheck', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

/*Authentication Routes*/
Route.post('/register', 'AuthController.register')

Route.post('/login', 'AuthController.login')

Route.post('logout', 'AuthController.logout')

/*Posts Routes*/
Route.get('/posts', 'PostsController.showAll')

Route.get('/posts/:id', 'PostsController.show').where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id)
})

//Route.get('/posts/*', 'controllername') in controller: if(params.tag => filter by tag)

Route.get('/posts/filter/:filters', 'PostsController.getFilteredPosts')

Route.get('/posts/byuser/:userId', 'PostsController.showAllByUserId')

Route.post('/posts', 'PostsController.create')

Route.delete('/posts/:id', 'PostsController.delete')

Route.group(() => {
  Route.get('/posts/like/:id', 'PostsController.likePost')

  Route.get('/posts/hasuserliked/:id', 'PostsController.hasUserLikedPost')
})


/*User Routes*/
Route.get('/users', 'UsersController.showAll')

Route.get('/users/:id', 'UsersController.show').where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id)
})

Route.get('/users/profile', async ({ auth }) => {
  await auth.use('api').authenticate()
  const user: User = await auth.use('api').user!

  let responseInfo = {
    username: user.username,
    email: user.email,
  }

  return responseInfo
})

Route.get('/users/profile/:username', 'UsersController.showByUsername')

Route.post('/users', 'UsersController.create')

Route.delete('/users/:id', 'UsersController.destroy')
