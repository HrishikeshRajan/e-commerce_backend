import type IDatabaseService from '../types/IDatabase.interfaces';
/**
 * @class Singleton class that handles database connections.
 * This class not ment to be instantiated.
 * Do not make constructor public.
 * Use the get instance method for accessing the class object
 */
declare class DatabaseSingleton implements IDatabaseService {
    private static instance;
    private constructor();
    /**
         *
         * @param databaseURL {string} -  database url
         * @returns - Nothing
         */
    connectDatabase(databaseURL: string): Promise<void>;
    /**
         * @returns Singleton object
         */
    static getInstance(): DatabaseSingleton;
}
export default DatabaseSingleton;
//# sourceMappingURL=databaseSingleton.config.d.ts.map