export abstract class StringHelper {
    public static NegateNonEscapeBackslash(
        content: string
    ): string {
        return content.replace('\\', '\\\\');
    }
}