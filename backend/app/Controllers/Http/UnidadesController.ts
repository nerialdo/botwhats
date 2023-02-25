import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Unidade from 'App/Models/Unidade';
import User from 'App/Models/User';

export default class UnidadesController {

  public async index ({auth, request, response}: HttpContextContract) {
    // const user = await User.find(auth.user.id)
    const unidades = await Unidade.all()
    return { data: unidades}
  }

  public async store ({auth, request, response}: HttpContextContract) {
    let data = request.all();
    console.log("data store", data)
    const unidade = await Unidade.create({
      name: data.name,
      cnes: data.cnes,
    });

    return { data: unidade}
  }

  public async show ({auth, params}: HttpContextContract) {
    const unidade = await Unidade.findOrFail(params.id)
    return { data: unidade}
  }

  public async update ({params, request}: HttpContextContract) {
    let data = request.all();
    // console.log("data", data)
    const unidade = await Unidade.findOrFail(params.id)
    unidade.merge({
      name: data.name,
      cnes: data.cnes,
    });
    await unidade.save();
    return { data: unidade}
  }

  public async destroy ({params}: HttpContextContract) {

    const unidade = await Unidade.findByOrFail('id', params.id);
    unidade.delete()
    return { data: 'Removido com sucesso'}
  }

}
