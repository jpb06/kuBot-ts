export function stringify(
    cookies: string[]
): string {
    return cookies.map((cookie) => {
        return cookie.substring(0, cookie.indexOf(';'));
    }).join(';');
}