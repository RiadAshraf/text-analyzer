const textModel = require('../models/textModel');
const logger = require('../utils/logger');

exports.createText = async (req, res) => {
    const { content, user } = req.body;
    try {
        const newText = await textModel.createText(content, user);

        // Perform text analysis
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const characterCount = content.replace(/\s+/g, '').length;
        const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
        const paragraphCount = content.split(/\n+/).filter(Boolean).length;
        const longestWord = content.split(/\s+/).reduce((longest, word) => word.length > longest.length ? word : longest, '');

        // Return the analysis results along with the created text
        res.status(201).json({
            id: newText.id,
            wordCount,
            characterCount,
            sentenceCount,
            paragraphCount,
            longestWord,
        });
    } catch (err) {
        logger.error(`CreateText: Error creating text - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.getAllTexts = async (req, res) => {
    try {
        logger.info('GetAllTexts: Fetching all texts');
        const texts = await textModel.getAllTexts();
        logger.info(`GetAllTexts: Fetched ${texts.length} texts`);
        res.json(texts);
    } catch (err) {
        logger.error(`GetAllTexts: Error fetching texts - ${err.message}`);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getText = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`GetText: Fetching text with ID ${id}`);
        const text = await textModel.getTextById(id);
        if (!text) {
            logger.warn(`GetText: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Not found' });
        }
        logger.info(`GetText: Text with ID ${id} retrieved successfully`);
        res.json(text);
    } catch (err) {
        logger.error(`GetText: Error fetching text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.updateText = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        logger.info(`UpdateText: Updating text with ID ${id}`);
        const updatedText = await textModel.updateText(id, content);
        if (!updatedText) {
            logger.warn(`UpdateText: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Not found' });
        }
        logger.info(`UpdateText: Text with ID ${id} updated successfully`);
        res.json(updatedText);
    } catch (err) {
        logger.error(`UpdateText: Error updating text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.deleteText = async (req, res) => {
    const { id } = req.params;
    try {
        logger.info(`DeleteText: Deleting text with ID ${id}`);
        const deletedText = await textModel.deleteText(id);
        if (!deletedText) {
            logger.warn(`DeleteText: Text with ID ${id} not found`);
            return res.status(404).json({ error: 'Not found' });
        }
        logger.info(`DeleteText: Text with ID ${id} deleted successfully`);
        res.json(deletedText);
    } catch (err) {
        logger.error(`DeleteText: Error deleting text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};