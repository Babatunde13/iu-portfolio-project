import { writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'
import categoryModel from '../models/categories.model.server'
import passwordModel from '../models/passwords.models.server'
import userModel from '../models/users.models.server'
import capitalizeString from './capitalize_string.util'
import { createDbConnection } from '../db_connection'

interface User {
    email: string
    password: string
    name: string
}
/**
 * Generates fake data for testing
 */
class FakeData {
    users: User[] = []
    /**
     * Creates a fake user
     */
    async createUser() {
        const password = 'pasHdg2$(#'
        const user = {
            firstName: capitalizeString(faker.person.firstName()),
            lastName: capitalizeString( faker.person.lastName()),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password,
        }

        const { data: u } = await userModel.createAndSave(user)
        return u
    }

    /**
     * Creates a fake password category
     */
    async createCategory(userId: string) {
        const category = {
            name: faker.lorem.word(),
            user: userId
        }

        const { data: c } = await categoryModel.createAndSave(category)
        return c
    }

    /**
     * Creates a fake password
     */
    async createPassword(userId: string, categoryId: string) {
        const password = {
            user: userId,
            category: categoryId,
            website: faker.internet.domainName(),
            account_name: faker.internet.userName(),
            password: faker.internet.password(),
            username: faker.internet.userName(),
        }

        const { data: p } = await passwordModel.createAndSave(password)
        return p
    }

    /**
     * Creates fake data for testing
     */
    async createFakeData() {
        const db = await createDbConnection()
        if (!db.data) return
        console.log('Creating fake data for 10 users')
        for (let i = 0; i < 10; i++) {
            const user = await this.createUser()
            if (!user) continue
            this.users.push({
                email: user.email,
                password: 'pasHdg2$(#',
                name: `${user.firstName} ${user.lastName}`
            })
            for (let j = 0; j < 5; j++) {
                const category = await this.createCategory(user._id.toString())
                if (!category) continue
                for (let k = 0; k < 5; k++) {
                    await this.createPassword(user._id.toString(), category._id.toString())
                }

            }
        }

        console.log('Created fake data for 10 users')
        console.log('Saving fake data to file: ' + './users.json')
        const filePath = '../users.json'
        await this.saveToFile(this.users, filePath)
        process.exit(0)
    }

    /**
     * Saves fake data to file
     */
    async saveToFile(data: User[], path: string) {
        await writeFile(path, JSON.stringify(data, null, 2))
    }
}

const fakeData = new FakeData()
fakeData.createFakeData()
