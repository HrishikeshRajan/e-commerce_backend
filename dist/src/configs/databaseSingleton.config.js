"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @class Singleton class that handles database connections.
 * This class not ment to be instantiated.
 * Do not make constructor public.
 * Use the get instance method for accessing the class object
 */
class DatabaseSingleton {
    static instance = null;
    constructor() {
    }
    /**
         *
         * @param databaseURL {string} -  database url
         * @returns - Nothing
         */
    async connectDatabase(databaseURL) {
        try {
            mongoose_1.default.Promise = global.Promise;
            await mongoose_1.default.connect(databaseURL);
            if (mongoose_1.default.connection.readyState === 1) {
                console.log('Connected to the database.');
            }
            else {
                console.log('Not connected to the database.');
            }
            mongoose_1.default.connection.on('error', () => {
                throw new Error(`unable to connect to database: ${databaseURL}`);
            });
        }
        catch (error) {
            console.log('Opps! Please check the database running or not', error);
        }
    }
    /**
         * @returns Singleton object
         */
    static getInstance() {
        if (DatabaseSingleton.instance === null) {
            DatabaseSingleton.instance = new DatabaseSingleton();
        }
        return DatabaseSingleton.instance;
    }
}
exports.default = DatabaseSingleton;
//# sourceMappingURL=databaseSingleton.config.js.map