export default interface IDatabase {
  connectDatabase: (URL: string) => Promise<void>
}
