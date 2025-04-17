const textModel = require('../models/textModel');
const logger = require('../utils/logger'); // Import logger

// Helper function to clean and split text
const cleanText = (text) => text.replace(/[^a-zA-Z0-9\s.]/g, '').toLowerCase();

exports.getWordCount = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetWordCount: Fetching word count for text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetWordCount: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Text not found' });
        }

        const wordCount = cleanText(text.content).split(/\s+/).filter(Boolean).length;
        logger.info(`GetWordCount: Word count for text with ID ${id} is ${wordCount}`);
        res.json({ wordCount });
    } catch (err) {
        logger.error(`GetWordCount: Error fetching word count for text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getCharacterCount = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetCharacterCount: Fetching character count for text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetCharacterCount: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Text not found' });
        }

        const characterCount = cleanText(text.content).replace(/\s+/g, '').length;
        logger.info(`GetCharacterCount: Character count for text with ID ${id} is ${characterCount}`);
        res.json({ characterCount });
    } catch (err) {
        logger.error(`GetCharacterCount: Error fetching character count for text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getSentenceCount = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetSentenceCount: Fetching sentence count for text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetSentenceCount: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Text not found' });
        }

        const sentenceCount = cleanText(text.content).split(/[.!?]+/).filter(Boolean).length;
        logger.info(`GetSentenceCount: Sentence count for text with ID ${id} is ${sentenceCount}`);
        res.json({ sentenceCount });
    } catch (err) {
        logger.error(`GetSentenceCount: Error fetching sentence count for text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getParagraphCount = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetParagraphCount: Fetching paragraph count for text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetParagraphCount: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Text not found' });
        }

        const paragraphCount = text.content.split(/\n+/).filter(Boolean).length;
        logger.info(`GetParagraphCount: Paragraph count for text with ID ${id} is ${paragraphCount}`);
        res.json({ paragraphCount });
    } catch (err) {
        logger.error(`GetParagraphCount: Error fetching paragraph count for text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getLongestWord = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetLongestWord: Fetching longest word for text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetLongestWord: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Text not found' });
        }

        const words = cleanText(text.content).split(/\s+/);
        const longestWord = words.reduce((longest, word) => word.length > longest.length ? word : longest, '');
        logger.info(`GetLongestWord: Longest word for text with ID ${id} is "${longestWord}"`);
        res.json({ longestWord });
    } catch (err) {
        logger.error(`GetLongestWord: Error fetching longest word for text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getTotalWordCount = async (req, res) => {
    try {
        logger.info('GetTotalWordCount: Fetching total word count for all texts');
        const texts = await textModel.getAllTexts();
        const totalWordCount = texts.reduce((count, text) => {
            return count + cleanText(text.content).split(/\s+/).filter(Boolean).length;
        }, 0);
        logger.info(`GetTotalWordCount: Total word count for all texts is ${totalWordCount}`);
        res.json({ totalWordCount });
    } catch (err) {
        logger.error(`GetTotalWordCount: Error fetching total word count - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getTotalCharacterCount = async (req, res) => {
    try {
        logger.info('GetTotalCharacterCount: Fetching total character count for all texts');
        const texts = await textModel.getAllTexts();
        const totalCharacterCount = texts.reduce((count, text) => {
            return count + cleanText(text.content).replace(/\s+/g, '').length;
        }, 0);
        logger.info(`GetTotalCharacterCount: Total character count for all texts is ${totalCharacterCount}`);
        res.json({ totalCharacterCount });
    } catch (err) {
        logger.error(`GetTotalCharacterCount: Error fetching total character count - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};