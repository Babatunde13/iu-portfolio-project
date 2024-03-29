import { BaseReq, BaseMiddleware } from '../api_contracts/base_request.ctrl.contract'
import { decodeUser } from '../utils/jwt.utils'
import isError from '../utils/is_error.utils'
import User from '../models/users.models.server'

/**
 * 
 * This middleware checks if the user's token is valid
 * It also adds the user to the request object if the token is valid
 */
export default async function requiresLogin (req: BaseReq): BaseMiddleware {
    let token = req.headers['authorization']
    if (!token || typeof token !== 'string' ||  token.split(' ')[0] !== 'Bearer') {
        return {
            success: false,
            message: 'Invalid token',
            options: {
                status: 401
            }
        }
    }

    token = token.split(' ')[1]
    const decodedUser = decodeUser(token)
    if (isError(decodeUser) || !decodedUser.data) {
        return {
            success: false,
            message: 'Invalid token',
            options: {
                status: 401
            }
        }
    }

    const user = await User.findOne({ _id: decodedUser.data })
    if (isError(user) || !user.data) {
        return {
            success: false,
            message: 'Invalid token',
            options: {
                status: 401
            }
        }
    }

    req.user = user.data
    return {
        isMiddleware: true
    }
}
