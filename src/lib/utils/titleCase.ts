export function toTitleCase(str: string): string {
    const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'with', 'in']);
    const technicalTerms = new Set(['eip']);
    const romanNumeralPattern = /(^|\s|-)(I{1,3}|IV|V|VI{1,3}|IX|X)(\s|$|:)/i;
    const hyphenatedEipPattern = /^(eip)-(\d+)$/i;

    return str.split(' ').map((word, index) => {
        const eipMatch = word.match(hyphenatedEipPattern);
        if (eipMatch) {
            const [, eipPart, numberPart] = eipMatch;
            return `${eipPart.toUpperCase()}-${numberPart}`;
        }

        if (technicalTerms.has(word.toLowerCase())) {
            return word.toUpperCase();
        }

        const romanMatch = word.match(romanNumeralPattern);
        if (romanMatch) {
            const [fullMatch, prefix, romanPart] = romanMatch;
            return word.replace(romanPart, romanPart.toUpperCase());
        }
        
        if (index === 0 || !minorWords.has(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
    }).join(' ');
}