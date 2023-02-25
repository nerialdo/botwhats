import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import EspecialidadeUser from 'App/Models/EspecialidadeUser';

export default class EspecialidadeUsersController {

  public async store ({request}: HttpContextContract) {
    let data = request.all();
    console.log("data store", data)
    const especialidade = await EspecialidadeUser.create({
      user_id: data.user_id,
      especialidade_id: data.especialidade_id,
    });

    return { data: especialidade}
  }

  public async update ({params, request}: HttpContextContract) {
    let data = request.all();
    console.log("data update relacionamento", data, params)
    const especialidade = await EspecialidadeUser.findOrFail(params.id)
    especialidade.merge({
      especialidade_id: data.especialidade_id,
    });
    await especialidade.save();
    return { data: especialidade}
  }

}
