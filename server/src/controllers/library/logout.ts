import isError from '../../utils/is_error.utils'
import { TokenTypes } from '../../models/tokens.model.client'
import tokenModel from '../../models/tokens.model.server'
import AppError from '../../shared/AppError'

/**
 * Logout a user by deleting the refresh token from the database
 */ 
export const logout = async (refreshToken: string ) => {
    const removeRefreshTokenDoc = await tokenModel.deleteOne({
        token: refreshToken,
        type: TokenTypes.REFRESH,
        blacklisted: false,
    })
    if (isError(removeRefreshTokenDoc) || !removeRefreshTokenDoc.data) {
        return { error: new AppError('Not found') }
    }
    
    return { data: 'logout successful' }
}
