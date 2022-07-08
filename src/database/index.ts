import { createConnection, Connection, getConnectionOptions, SimpleConsoleLogger } from 'typeorm';

export default async (host: string = "localhost"): Promise<Connection> => {

  const requireDatabaseDefaultOptions = await getConnectionOptions();

  console.log("O database foi instanciado...");

  return await createConnection(

    Object.assign(requireDatabaseDefaultOptions, {

      host: process.env.NODE_ENV === 'test'
        ? 'localhost'
        : host,
      database: process.env.NODE_ENV === 'test'
        ? 'fin_api'
        : requireDatabaseDefaultOptions.database
    })
  );

}