// import  from "../configs/database.config";
import type IDatabaseService from '../types/IDatabase.interfaces'

/* eslint-disable class-methods-use-this */

class DatabaseService {
  async connectDatabase (database: IDatabaseService, URL: string): Promise<void> {
    database.connectDatabase(URL)
  }
}

export default DatabaseService
