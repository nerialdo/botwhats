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

//https://github.com/Shagital/adonisjs-acl

import Route from '@ioc:Adonis/Core/Route'

import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

import Ws from 'App/Services/Ws'

Route.group(() => {
  Route.get('/', async () => {
    Ws.io.emit('news', { username: 'virk' })
    return { hello: 'world' }
  })

  Route.post('sessions', async ({ auth, request, response }) => {
    // const email = request.input('email')
    // const password = request.input('password')

    // try {
    //   const token = await auth.use('api').attempt(email, password)
    //   return token
    // } catch {
    //   return response.unauthorized('Invalid credentials')
    // }

    const email = request.input('email')
    const password = request.input('password')

    // Lookup user manually
    const user = await User
      .query()
      .where('email', email)
      // .where('tenant_id', getTenantIdFromSomewhere)
      // .whereNull('is_deleted')
      .firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.unauthorized('Invalid credentials')
    }

    // Generate token
    const token = await auth.use('api').generate(user)
    return {
      'data': user,
      'token' : token.token,
    }

  })

  //Rotas protegidas
  Route.group(() => {

    Route.get('profissionais', 'ProfissionalsController.index').middleware('is:administrador')
    Route.get('profissionais/:id', 'ProfissionalsController.show').middleware('is:administrador')
    Route.post('profissionais/:id', 'ProfissionalsController.update').middleware('is:administrador')
    Route.post('profissionais/', 'ProfissionalsController.store').middleware('is:administrador')
    Route.delete('profissionais/:id', 'ProfissionalsController.destroy').middleware('is:administrador')

  }).middleware('auth')


}).prefix('/api')

// Route.group(() => {
//   Route.get('/unidades', async () => {
//     return { hello: 'world' }
//   })
// }).prefix('/api').middleware('auth')

