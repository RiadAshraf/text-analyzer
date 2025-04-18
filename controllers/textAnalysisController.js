const textAnalysisModel = require('../models/textAnalysisModel');

exports.getWordCount = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    console.log
    const wordCount = textAnalysisModel.calculateWordCount(content);
    res.json({ result: wordCount });
};

exports.getCharacterCount = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const characterCount = textAnalysisModel.calculateCharacterCount(content);
    res.json({ result: characterCount });
};

exports.getSentenceCount = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const sentenceCount = textAnalysisModel.calculateSentenceCount(content);
    res.json({ result: sentenceCount });
};

exports.getParagraphCount = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const paragraphCount = textAnalysisModel.calculateParagraphCount(content);
    res.json({ result: paragraphCount });
};

exports.getLongestWord = (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const longestWord = textAnalysisModel.findLongestWord(content);
    res.json({ result: longestWord });
};