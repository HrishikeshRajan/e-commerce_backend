import UserRepository from '../repository/user.repository'
import UserServices from '../services/user.services'

const USER = {
  UserRepository,
  UserServices
}

Object.freeze(USER)
export default USER
