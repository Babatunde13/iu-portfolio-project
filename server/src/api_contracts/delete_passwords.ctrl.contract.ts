import { isValidObjectId } from 'mongoose'
import { BaseReq, SuccessResponse, ErrorResponse } from './base_request.ctrl.contract'
import { IUSer } from '../models/users.models.server'
import AppError from '../shared/AppError'

export interface ClientReq {
   _ids: string[]

}

export interface Req extends BaseReq {
    body: ClientReq
    user: IUSer
}

export type Res = Promise<ErrorResponse | SuccessResponse<string>>

export const validationConfig = (data: ClientReq) => {
    const ids = data._ids
    for (const id of ids) {
        if (!isValidObjectId(id)) {
            return { error: new AppError('Invalid category id') }
        }
    }

    return {
        data: true
    }
}
