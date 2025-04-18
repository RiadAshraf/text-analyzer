exports.calculateWordCount = (text) => {
    console.log('Calculating word count...');
    return text.split(/\s+/).filter(Boolean).length;
};

exports.calculateCharacterCount = (text) => {
    return text.length;
};

exports.calculateSentenceCount = (text) => {
    return text.split(/[.!?]+/).filter(Boolean).length;
};

exports.calculateParagraphCount = (text) => {
    return text.split(/\n+/).filter(Boolean).length;
};

exports.findLongestWord = (text) => {
    const words = text.split(/\s+/).filter(Boolean);
    return words.reduce((longest, word) => word.length > longest.length ? word : longest, '');
};