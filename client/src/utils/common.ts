export function cutText(text: string, length_text: number = 35) {
     return text.length > length_text ? text.substring(0, length_text) + "..." : text
}