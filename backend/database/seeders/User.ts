import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        nome: 'Nerialdo Ferreira',
        email: 'nerialdosousa@hotmail.com',
        password: '123456',
      },
      {
        nome: 'Nerialdo Moreira',
        email: 'nerialdo@gmail.com',
        password: '123456'
      }
    ])
  }
}
