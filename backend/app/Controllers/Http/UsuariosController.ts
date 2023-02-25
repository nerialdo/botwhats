import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsuariosController {
  public async index ({auth, request, response}: HttpContextContract) {
    // const user = await User.find(auth.user.id)
    // const user = await User.all()
    const users = await User
    .query()
    .preload('especialidades')
    .has('especialidades', '>', 0)
    .orderBy('id', 'desc')
    return { data: users}
  }

  public async store ({auth, request, response}: HttpContextContract) {
    let data = request.all();
    // console.log("data store profissional", data)
    const user = await User.create({
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      status: data.status,
      password: data.password
    });

    return { data: user}
  }

  public async show ({auth, params}: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    await user.load('especialidades')
    return { data: user}
  }

  public async update ({params, request}: HttpContextContract) {
    let data = request.all();
    console.log("data update", data)
    const user = await User.findOrFail(params.id)
    if(data.password === 'undefined'){
      user.merge({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cns: data.cns,
      });

      await user.save();
      return { data: user}
    }else{
      user.merge({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        cns: data.cns,
        password: data.password
      });

      await user.save();
      return { data: user}
    }

  }

  public async destroy ({params}: HttpContextContract) {
    console.log('paramsdelete', params)
    const user = await User.findByOrFail('id', params.id);
    user.delete()
    return { data: 'Removido com sucesso'}
  }
}
