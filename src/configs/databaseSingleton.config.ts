import mongoose from 'mongoose'
import type IDatabaseService from '../types/IDatabase.interfaces'

/**
 * @class Singleton class that handles database connections.
 * This class not ment to be instantiated.
 * Do not make constructor public.
 * Use the get instance method for accessing the class object
 */
class DatabaseSingleton implements IDatabaseService {
  private static instance: DatabaseSingleton | null = null
  private constructor () {
  }

  /**
       *
       * @param databaseURL {string} -  database url
       * @returns - Nothing
       */
  async connectDatabase (databaseURL: string): Promise<void> {
    try {
      await mongoose.connect(databaseURL)
      if (mongoose.connection.readyState === 1) {
        console.log('Connected to the database.')
      } else {
        console.log('Not connected to the database.')
      }
    } catch (error: any) {
      console.log('Opps! Please check the database running or not', error)
      process.exit(1)
    }
  }

  /**
       * @returns Singleton object
       */
  public static getInstance (): DatabaseSingleton {
    if (DatabaseSingleton.instance === null) {
      DatabaseSingleton.instance = new DatabaseSingleton()
    }
    return DatabaseSingleton.instance
  }
}

export default DatabaseSingleton
