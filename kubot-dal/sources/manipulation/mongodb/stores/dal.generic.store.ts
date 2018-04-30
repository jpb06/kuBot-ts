import { MongoClient }  from 'mongodb';

import { DalConfiguration } from './../../../configuration/dal.configuration';

export abstract class GenericStore {

    public static async createOrUpdate(
        collectionName: string,
        term: object,
        value: object
    ): Promise<boolean> {
        DalConfiguration.Verify();

        const client = await MongoClient.connect(DalConfiguration.url);
        
        try {
            let db = client.db(DalConfiguration.database);
            let collection = db.collection(collectionName);

            await collection.findOneAndUpdate(term, value, { upsert: true });

            return true;
        } finally {
            client.close();
        }
    }

    public static async clearAndCreateMany(
        collectionName: string,
        term: object,
        values: Array<object>
    ): Promise<boolean> {
        DalConfiguration.Verify();

        const client = await MongoClient.connect(DalConfiguration.url);
        
        try {
            let db = client.db(DalConfiguration.database);
            let collection = db.collection(collectionName);

            await collection.deleteMany(term);
            await collection.insertMany(values);

            return false;
        } finally {
            client.close();
        }
    }

    public static async clearAllAndCreateMany(
        collectionName: string,
        values: Array<object>
    ): Promise<boolean> {
        return await GenericStore.clearAndCreateMany(collectionName, {}, values);
    }

    public static async getAll(
        collectionName: string
    ): Promise<Array<object>> {
        DalConfiguration.Verify();

        const client = await MongoClient.connect(DalConfiguration.url);
        
        try {
            let db = client.db(DalConfiguration.database);
            let collection = db.collection(collectionName);

            const result = await collection.find().toArray();

            return result;
        } finally {
            client.close();
        }
    }

    public static async getBy(
        collectionName: string,
        term: object,
        sort: object
    ): Promise<Array<object>> {
        DalConfiguration.Verify();

        const client = await MongoClient.connect(DalConfiguration.url);
        
        try {
            let db = client.db(DalConfiguration.database);
            let collection = db.collection(collectionName);

            const result = await collection
                .find(term)
                .sort(sort)
                .toArray();

            return result;
        } finally {
            client.close();
        }
    }

    public static async remove(
        collectionName: string,
        term: object
    ): Promise<boolean> {
        DalConfiguration.Verify();

        const client = await MongoClient.connect(DalConfiguration.url);
        
        try {
            let db = client.db(DalConfiguration.database);
            let collection = db.collection(collectionName);

            let result = await collection.deleteOne(term);

            return result.deletedCount === 1;
        } finally {
            client.close();
        }
    }
}