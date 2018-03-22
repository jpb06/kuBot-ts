﻿import { get } from 'https';
import { createWriteStream, unlink } from 'fs';

export function save(url, dest) {
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

export function append(
    path: string,
    content: string
) {
    return new Promise((resolve, reject) => {
        let stream = createWriteStream(path, { flags: 'a' });
        stream.write(content);
        stream.end();
        resolve();
    });
}

export function remove(path: string) {
    unlink(path, function (err) {
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            }

            resolve();
        });
    });
}