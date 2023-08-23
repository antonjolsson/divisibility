export interface IRule {
    divisor: number,
    name: string,
    explanation: string
    divides: boolean[]
}

export function getDigitSum(number: number): number {
    return String(number)
        .split('')
        .map(s => parseInt(s))
        .reduce((p, c) => p + c)
}

export function isEvenLongVersion(n: number): boolean {
    const str = String(n)
    return [0, 2, 4, 6, 8].includes(parseInt(str[str.length - 1]));
}

export function getNLastDigits(number: number, numOfDigits: number): number {
    return parseInt(String(number)
        .split('')
        .slice(-numOfDigits)
        .join(''))
}

function getNumberAsDigits(number: number): number[] {
    const str = String(number)
    return str.split('').map(s => parseInt(s));
}

export function getAlternatingSum(dividend: number,
                                  continueCondition: (number: number, tries: number) => boolean): number {
    let tries = 0
    while (continueCondition(dividend, tries++)) {
        dividend = getNumberAsDigits(dividend)
            .reduce((acc, curr, i) => {
                if (i === 0) return acc
                if (i % 2 === 0) return acc + curr
                return acc - curr
            }) // Alternating sum!
    }
    return dividend;
}

export function divisibleBy11(dividend: number): boolean {
    dividend = getAlternatingSum(dividend, (number: number, tries: number) => number > 11 && tries < 100);
    return [0, 11].includes(dividend);
}

export function divisibleBy4(number: number): boolean {
    return isEvenLongVersion(getNLastDigits(number, 2) / 2);
}

export function get5XLastPlusRest(number: number): number {
    const last = getNLastDigits(number, 1)
    const rest = Math.trunc(number / 10)
    return 5 * last + rest;
}

export function divisibleBy7(number: number): boolean {
    do {
        number = get5XLastPlusRest(number);
    } while (number > 98)
    return number % 7 === 0
}
