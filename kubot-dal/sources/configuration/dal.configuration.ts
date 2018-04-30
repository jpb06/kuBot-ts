export abstract class DalConfiguration {
    public static url: string;
    public static database: string;

    public static Setup(
        url: string,
        database: string
    ): void {
        this.url = url;
        this.database = database;
    }

    public static Verify(): void {
        if (this.url === undefined || this.url.length === 0) {
            throw new Error('No url specified to access mongodb instance');
        } 

        if (this.database === undefined || this.url.length === 0) {
            throw new Error('No database specified');
        }
    }

    public static SwitchDatabase(database: string): void {
        this.database = database;
    }
}