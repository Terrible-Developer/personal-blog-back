import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        username: 'admin',
        email: 'primateadmin@gmail.com',
        password: process.env.USER_SEEDS_TEMPLATE_PASSWORD,
        isAdmin: true
      },
      {
        username: 'Terrible-Developer',
        email: 'victorbparo@gmail.com',
        password: process.env.USER_SEEDS_TEMPLATE_PASSWORD,
        isAdmin: true
      },
      {
        username: 'wyvern800',
        email: 'wyvern800@hotmail.com',
        password: process.env.USER_SEEDS_TEMPLATE_PASSWORD,
        isAdmin: true
      }
    ])
  }
}
