export interface LastFetch {
    target: string;
    date: string;
}

export function isLastFetch(obj: any): obj is LastFetch {
    return (
        typeof obj.target === "string" &&
        typeof obj.date === "string"
    );
}