import express, { NextFunction, Request, Response } from 'express'
import requestLogger from 'morgan'
import cors from 'cors'
import envs from './envs'
import { HttpMethod, ServerConfig } from './server.types'
import logger from './shared/logger'

const corsConfig = {
    // Methods we allow
    methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    // Allows all header
    headers: '*',
    // Allow requests from all domains
    origins: '*', // Allows all origins
}

/**
 * This function starts the server and returns the express app
 * @param config  The server config object containing the port and route list
 * @returns The express app
 */
export const startServer = async (config: ServerConfig) => {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.set('trust proxy', true)
    if (envs.env !== 'test') {
        app.use(requestLogger('dev'))
    }

    // I am looping through the routes and add them to the express app
    // Each route has a path, method and handlers where handlers is a list of request handlers
    // Each handler is a function that takes in the request and returns a response
    // The response is an object with the following properties
    // success: boolean - Indicates if the request was successful
    // message: string - The message to be returned to the client
    // data: any - The data to be returned to the client
    // options: any - Any other options to be returned to the client
    // isMiddleware: boolean - Indicates if the response is a middleware
    // If there are more than one handler, the handlers are executed in order where
    // all handlers except the last one must return a middleware
    config.routes.forEach((route) => {
        const { handlers, path, method } = route
        const middlewares = handlers.map((handler) => {
            return async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await handler(req) as any
                    if (result?.options?.status && typeof result.options.status === 'number') {
                        res.status(result.options.status)
                        if (result.options.status >= 400) { // Error
                            delete result.options
                            res.json(result)
                            return
                        }
                    }
                    if (result?.options?.redirect) { // Redirect
                        res.redirect(result.options.redirect)
                        return
                    }
                    if (result.options?.sendString) { // Send string data
                        res.send(result.message)
                        return
                    }
                    
                    delete result?.options
                    if (result?.isMiddleware) { // Middleware
                        next()
                    } else {
                        res.json(result)
                    }
                } catch (error) {
                    console.log(error)
                    next(error)
                }
            }
        })

        // Add the route to the express app based on the method
        // I'm only supporting GET, POST, PUT and DELETE methods for now.
        if (method === HttpMethod.POST) {
            app.post(path, ...middlewares)
        } else if (method === HttpMethod.GET) {
            app.get(path, ...middlewares)
        } else if (method === HttpMethod.PUT) {
            app.put(path, ...middlewares)
        } else if (method === HttpMethod.DELETE) {
            app.delete(path, ...middlewares)
        }
    })

    // Add a middleware to handle cors
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', corsConfig.origins)
        res.header('Access-Control-Allow-Headers', corsConfig.headers)
        if (req.method === 'OPTIONS') {
            // preflight request
            res.header('Access-Control-Allow-Methods', corsConfig.methods)
            return res.status(200).json({})
        }

        return next()
    })

    // Add a middleware to handle endpoints that are not found
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            message: 'Resource not found',
            data: null
        })
    })

    // Listen for requests on the port specified in the config
    app.listen(config.port, () => {
        logger.info(`Server listening on port ${config.port} 🚀`, 'Server Startup')
    })

    return app
}

export default startServer
