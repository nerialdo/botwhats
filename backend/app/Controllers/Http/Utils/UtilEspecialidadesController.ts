import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Especialidade from 'App/Models/Especialidade';

export default class UtilEspecialidadesController {
  public async buscar ({params}: HttpContextContract) {
    // const user = await User.find(auth.user.id)
    var termo = params.termo
    if(termo.length >= 3){
      if(!isNaN(parseFloat(termo))){
        const especialidades = await Especialidade.query()
            .where('cbo', 'like', params.termo + '%');
        return { data: especialidades}
      }else{
        const especialidades = await Especialidade.query()
            .where('name', 'like', params.termo + '%');
        return { data: especialidades}
      }
    }
  }
}
