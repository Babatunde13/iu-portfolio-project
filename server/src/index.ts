import { startServer } from './server'
import { routes } from './server_config'
import envs from './envs'
import { createDbConnection } from './db_connection'
import isError from './utils/is_error.utils'
import logger from './shared/logger'

/**
 * This function runs the server by connecting to the database and starting the server
 * This is the entry point of the application
 */
export const runServer = async () => {
    const connection = await createDbConnection()
    if (isError(connection)) {
        logger.error('Error connecting to database', 'Database Connection')
        return
    }
    await startServer({
        port: envs.port, 
        routes
    })
}
// only run the server if this file is run directly and not imported
if (require.main === module) {
    runServer()
}
