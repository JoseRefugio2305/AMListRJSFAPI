export function parseStringNumber(numString: string) {
     const numparse = parseInt(numString, 10);
     return Number.isNaN(numparse) || numparse <= 0 ? 0 : numparse;
}