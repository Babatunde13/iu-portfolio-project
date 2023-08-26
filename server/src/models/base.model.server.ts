import {
    ClientSession, Document, FilterQuery, Model, PipelineStage, Schema, SchemaDefinition, SchemaOptions, model
} from 'mongoose'
import { DataOrError } from '../types/dataOrError.types'
import AppError from '../shared/AppError'

interface SortOptions {
    [key: string]: 1 | -1
}

interface QueryOptions {
    limit?: number
    skip?: number
    sort?: SortOptions | string
    projection?: { [key: string]: number }
    session?: ClientSession
}

interface UpdateOptions {
    upsert?: boolean
    multi?: boolean
    new?: boolean
    session?: ClientSession
}

export type ModelAPI<T> = T & {
    _id: string
    active: boolean
    toJSON(): T
}
type Doc<T> = Document & T
interface CreateModelOptions<T, ModelClient> {
    name: string
    schema: SchemaDefinition
    options?: SchemaOptions
    /**
     * preSave is called before the document is saved in the database.
     * The document is not save if preSave returns an error.
     */
    preSave?: (document: T) => Promise<DataOrError<T>>

    /**
     * toJson is called before the document is sent to the client side (objects are stringified over the network).
     * toJson is called recursively on sub documents.
     */
    toJSON: (o: T) => ModelClient
}

/**
 * BaseModel is a wrapper around mongoose model.
 * When creating a new model, BaseModel creates a schema with the following properties:
 * active:, created, updated
 * It provides a simple interface for creating, finding, updating and deleting documents.
 * It also ensures that call to db does not throw an error but returns an error object instead.
 * This is to ensure that the server does not crash when there is an error from the db.
 */
export class BaseModel<T extends ModelAPI<{}>, ModelClient> {
    schema: Schema
    modelName: string
    model: Model<T>

    constructor(options: CreateModelOptions<T, ModelClient>) {
        this.modelName = options.name
        this.schema = this.createSchema(options.schema)
        this.schema.set('toJSON', {
            transform: (doc: T) => options.toJSON(doc),
        })
        if (options.preSave) {
            this.schema.pre<Doc<T>>('save', async function () {
                const result = await options.preSave?.(this)
                if (result?.error) {
                    throw result.error
                }
            })
        }
    
        this.model = model<T>(this.modelName, this.schema)

    }

    /**
     * Creates a mongoose schema with the following additional properties:
     * active:, created, updated
     */
    private createSchema(schema: SchemaDefinition): Schema {
        return new Schema(
            {
                ...schema,
                active: { type: Boolean, default: true, index: true },
            },
            {
                timestamps: {
                    createdAt: 'created',
                    updatedAt: 'updated'
                }
            }
        )
    }

    /**
     * Creates a new document without saving it to the database
     */
    async create(data: Partial<T>): Promise<DataOrError<T>> {
        try {
            const doc = new this.model(data)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new AppError('Error creating document')
            }
        }
    }
    
    /**
     * Creates a new document and saves it to the database
     */ 
    async createAndSave(data: Partial<T>): Promise<DataOrError<T>> {
        try {
            const doc = await this.model.create(data)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new AppError('Error creating and saving document')
            }
        }
    }

    /**
     * Finds documents that match the query
     * It uses the query options to limit, skip, sort and project the result
     */
    async find(
        query: FindQuery<Partial<T>>,
        options?: QueryOptions,
    ): Promise<DataOrError<T[]>> {
        try {
            let docs = this.model.find(query, options?.projection)
            if (options?.limit) {
                docs = docs.limit(options.limit)
            }
            if (options?.skip) {
                docs = docs.skip(options.skip)
            }
            if (options?.sort) {
                docs = docs.sort(options.sort)
            }
            if (options?.session) {
                docs = docs.session(options.session)
            }
            const data = await docs.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new AppError('Error finding documents')
            }
        }
    }

    /**
     * Finds the first document that matches the query
     * It uses the query options to limit, skip, sort and project the result
     */
    async findOne(
        query: FindQuery<Partial<T>>,
        options?: QueryOptions
    ): Promise<DataOrError<T | null>> {
        try {
            let doc = this.model.findOne(query, options?.projection)
            if (options?.limit) {
                doc = doc.limit(options.limit)
            }
            if (options?.skip) {
                doc = doc.skip(options.skip)
            }
            if (options?.sort) {
                doc = doc.sort(options.sort)
            }
            if (options?.session) {
                doc = doc.session(options.session)
            }
            const data = await doc.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new AppError('Error finding document')
            }
        }
    }

    /**
     * Finds a document by id
     */
    async findById(
        id: string,
        options?: QueryOptions
    ): Promise<DataOrError<T | null>> {
        try {
            let doc = this.model.findOne({ _id: id }, options?.projection)
            if (options?.limit) {
                doc = doc.limit(options.limit)
            }
            if (options?.skip) {
                doc = doc.skip(options.skip)
            }
            if (options?.sort) {
                doc = doc.sort(options.sort)
            }
            if (options?.session) {
                doc = doc.session(options.session)
            }
            const data = await doc.exec()
            return {
                data,
            }
        } catch (error) {
            return {
                error: new AppError('Error finding document')
            }
        }
    }

    /**
     * Finds the first document that matches the query and updates it
     * It uses the query options to limit, skip, sort and project the result
     */
    async updateOne(
        query: FindQuery<T>,
        update: UpdateManyUpdate<T>,
        options: UpdateOptions = { new: true }
    ): Promise<DataOrError<T | null>> {
        try {
            const doc = await this.model.findOneAndUpdate(query, update, options)
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new AppError('Error updating document')
            }
        }
    }

    /**
     * Finds documents that match the query and updates them
     * It uses the query options to limit, skip, sort and project the result
     */
    async updateMany(
        query: FindQuery<T>,
        update: UpdateManyUpdate<T>,
        options: UpdateOptions = {}
    ) {
        try {
            const docs = await this.model.updateMany(query, update, options)
            return {
                data: docs,
            }
        } catch (error) {
            return {
                error: new AppError('Error updating documents')
            }
        }
    }

    /**
     * Finds the first document that matches the query and deletes it
     * It uses the query options, skip, sort to find the result
     */
    async deleteOne(
        query: FindQuery<T>,
        options: QueryOptions = {}
    ): Promise<DataOrError<T | null>> {
        try {
            const doc = await this.model.findOneAndDelete(query, options)
            
            return {
                data: doc,
            }
        } catch (error) {
            return {
                error: new AppError('Error deleting document')
            }
        }
    }

    /**
     * Finds documents that match the query and deletes them
     * It uses the query options to limit, skip to find the result
     */
    async deleteMany(
        query: FindQuery<T>,
        options: Omit<Omit<QueryOptions, 'projection'>, 'sort'> = {}
    ) {
        try {
            const docs = await this.model.deleteMany(query, options)
            return {
                data: docs,
            }
        } catch (error) {
            return {
                error: new AppError('Error deleting documents')
            }
        }
    }

    /**
     * Counts the number of documents that match the query
     * It uses the query options to limit, skip to count the result
     */
    async count(
        query: FindQuery<T>,
        options: QueryOptions = {}
    ) {
        try {
            const count = await this.model.countDocuments(query, options)
            return {
                data: count,
            }
        } catch (error) {
            return {
                error: new AppError('Error counting documents')
            }
        }
    }

    /**
     * Aggregates documents using the pipeline stages
     */
    async aggregate(
        pipeline: PipelineStage[]
    ) {
        try {
            const data = await this.model.aggregate(pipeline)
            return {
                data,
            }
        } catch (error) {
            return {
                error: new AppError('Error aggregating documents')
            }
        }
    }
}

type Query<T> = FilterQuery<T>
export type FindQuery<T> = Query<T> & {}

export type UpdateManyUpdate<T> = {
    $set?: Partial<T>
    $push?: Partial<T>
    $inc?: Partial<T>
    $max?: Partial<T>
}