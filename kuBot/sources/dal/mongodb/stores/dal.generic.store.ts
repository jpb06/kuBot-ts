import { MongoClient }  from 'mongodb';

export abstract class GenericStore {

    public static async createOrUpdate(
        collectionName: string,
        term: object,
        value: object
    ): Promise<boolean> {
        const client = await MongoClient.connect(process.env['mongodbUrl']);
        let db = client.db(process.env['mongodbBase']);

        try {
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
        const client = await MongoClient.connect(process.env['mongodbUrl']);
        let db = client.db(process.env['mongodbBase']);

        try {
            let collection = db.collection(collectionName);

            await collection.deleteMany(term);
            await collection.insertMany(values);

            return true;
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
        const client = await MongoClient.connect(process.env['mongodbUrl']);
        let db = client.db(process.env['mongodbBase']);

        try {
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
        const client = await MongoClient.connect(process.env['mongodbUrl']);
        let db = client.db(process.env['mongodbBase']);

        try {
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
        const client = await MongoClient.connect(process.env['mongodbUrl']);
        let db = client.db(process.env['mongodbBase']);

        try {
            let collection = db.collection(collectionName);

            let result = await collection.deleteOne(term);

            return result.deletedCount === 1;
        } finally {
            client.close();
        }
    }
}