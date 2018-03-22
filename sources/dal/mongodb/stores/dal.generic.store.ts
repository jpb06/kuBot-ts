﻿import { MongoClient }  from 'mongodb';

export abstract class GenericStore {

    public static async createOrUpdate(collectionName: string, term: object, value: object): Promise<boolean> {
        const client = await MongoClient.connect(process.env.kuBotConfig.mongodbUrl);
        let db = client.db(process.env.kuBotConfig.mongodbBase);

        try {
            let collection = db.collection(collectionName);

            await collection.findOneAndUpdate(term, value, { upsert: true });

            return true;
        } finally {
            client.close();
        }
    }

    public static async clearAndCreateMany(collectionName: string, term: object, values: Array<object>): Promise<boolean> {
        const client = await MongoClient.connect(process.env.kuBotConfig.mongodbUrl);
        let db = client.db(process.env.kuBotConfig.mongodbBase);

        try {
            let collection = db.collection(collectionName);

            await collection.deleteMany(term);
            await collection.insertMany(values);

            return true;
        } finally {
            client.close();
        }
    }

    public static async clearAllAndCreateMany(collectionName: string, values: Array<object>): Promise<boolean> {
        return await GenericStore.clearAndCreateMany(collectionName, {}, values);
    }

    public static async getAll(collectionName: string) : Promise<Array<object>> {
        const client = await MongoClient.connect(process.env.kuBotConfig.mongodbUrl);
        let db = client.db(process.env.kuBotConfig.mongodbBase);

        try {
            let collection = db.collection(collectionName);
            const result = await collection.find().toArray();

            return result;
        } finally {
            client.close();
        }
    }

    public static async getBy(collectionName: string, term: object): Promise<Array<object>> {
        const client = await MongoClient.connect(process.env.kuBotConfig.mongodbUrl);
        let db = client.db(process.env.kuBotConfig.mongodbBase);

        try {
            let collection = db.collection(collectionName);
            const result = await collection.find(term).toArray();

            return result;
        } finally {
            client.close();
        }
    }
}