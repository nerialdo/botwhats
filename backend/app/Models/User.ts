import Especialidade from 'App/Models/Especialidade'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'


export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public email: string

  @column()
  public status: string

  @column()
  public telefone: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // @manyToMany(() => Especialidade)
  // public especialidades: ManyToMany<typeof Especialidade>

  @manyToMany(() => Especialidade, {
    pivotTable: 'especialidade_users',
  })
  public especialidades: ManyToMany<typeof Especialidade>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
