import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Especialidade from 'App/Models/Especialidade';

export default class EspecialidadesController {
  public async index ({}: HttpContextContract) {
    // const user = await User.find(auth.user.id)
    const especialidades = await Especialidade.all()
    return { data: especialidades}
  }
}
