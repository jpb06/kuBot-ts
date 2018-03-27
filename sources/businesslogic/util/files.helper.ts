import { get } from 'https';
import { createWriteStream, unlink } from 'fs';

export abstract class FilesHelper {
    public static async Save(
        url: string,
        dest: string
    ): Promise<{}> {
        return new Promise((resolve, reject) => {
            var file = createWriteStream(dest);

            var request = get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    file.end();
                    resolve();
                });
            }).on('error', function (err) {
                file.end();
                unlink(dest); // Delete the file async. (But we don't check the result)
                reject(err);
            });
        });
    }

    public static async Append(
        path: string,
        content: string
    ): Promise<{}> {
        return new Promise((resolve, reject) => {
            let stream = createWriteStream(path, { flags: 'a' });
            stream.write(content);
            stream.end();
            resolve();
        });
    }

    public static Remove(
        path: string
    ): void {
        unlink(path, function (err) {
            return new Promise((resolve, reject) => {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }
}