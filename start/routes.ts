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

/*Testing and miscelaneous routes*/

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/testparams', async () => {
  return { test: 'route' }
})

Route.get('/testparams/:userId?', async ({ params }) => {
  console.log(params)
  return params.userId
}).where('userId', {
  match: /^[0-9]+$/,
  cast: (userId) => Number(userId)
})

Route.group(() => {
  Route.get('/authtest', async ({ auth }) => {
    await auth.use('api').authenticate()
    console.log(auth.use('api').user!)
  })
}).middleware('auth:api')


Route.get('/healthcheck', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

/*Authentication Routes*/
Route.post('/register', 'AuthController.register')

Route.post('/login', 'AuthController.login')

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


/*User Routes*/
Route.get('/users', 'UsersController.showAll')

Route.get('/users/:id', 'UsersController.show').where('id', {
  match: /^[0-9]+$/,
  cast: (id) => Number(id)
})

Route.post('/users', 'UsersController.create')

Route.delete('/users/:id', 'UsersController.destroy')
