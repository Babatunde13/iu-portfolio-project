import { BaseReq, SuccessResponse, ErrorResponse } from './base_request.ctrl.contract'
import { IUSer } from '../models/users.models.server'
import { CategoryClient } from '../models/categories.model.client'
import AppError from '../shared/AppError'

/**
 * This is the expected request body from the client
 */
export interface ClientReq {
    name: string
}

/**
 * This is the expected data to be returned to the client
 */
export type ClientRes = CategoryClient

/**
 * This is the expected request object
 */
export interface Req extends BaseReq {
    body: ClientReq
    user: IUSer
}

export type Res = Promise<ErrorResponse | SuccessResponse<ClientRes>>

/**
 * This is the validation configuration for the request body
 */
export const validationConfig = (data: ClientReq) => {
    if (typeof data.name !== 'string') {
        return { error: new AppError('Invalid category name') }
    }

    return {
        data: true
    }
}
