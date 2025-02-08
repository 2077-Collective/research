export function toTitleCase(str: string): string {
    const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'with', 'in']);
    
    const romanNumeralPattern = /^(I{1,3}|IV|V|VI{1,3}|IX|X)$/i;

    return str.split(' ').map((word, index) => {
        if (romanNumeralPattern.test(word)) {
            return word.toUpperCase();
        }
        
        if (index === 0 || !minorWords.has(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
    }).join(' ');
}