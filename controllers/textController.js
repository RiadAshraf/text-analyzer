const textModel = require('../models/textModel');
const logger = require('../utils/logger');

exports.createText = async (req, res) => {
    const { content, user } = req.body;
    try {

        if (!content || !user) {
            logger.warn('CreateText: Missing content or user in input');
            return res.status(400).json({ error: 'Content and user are required' });
        }

        if (content.length > 5000) {
            logger.warn('CreateText: Content exceeds maximum length');
            return res.status(400).json({ error: 'Content is too long' });
        }
        logger.info('CreateText: Inserting new text into the database');
        // Create the text in the database
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
            content: newText.content,
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

exports.getAllTextsByUser = async (req, res) => {
    try {
        const user = req.user.displayName; // Get the logged-in user's name
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 texts per page
        const offset = (page - 1) * limit;

        // Fetch texts with pagination
        const { rows: texts, rowCount: totalTexts } = await textModel.getAllTextsByUser(user, limit, offset);

        const totalPages = Math.ceil(totalTexts / limit);

        res.json({
            texts,
            currentPage: page,
            totalPages,
            totalTexts,
        });
    } catch (err) {
        console.error('Error fetching texts:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTextByUser = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const user = req.user.displayName; // Get the logged-in user's name
        logger.info(`UpdateTextByUser: Updating text with ID ${id} for user ${user}`);
        const updatedText = await textModel.updateText(id, content);
        if (!updatedText) {
            logger.warn(`UpdateTextByUser: Text with ID ${id} not found or not owned by user ${user}`);
            return res.status(404).json({ error: 'Not found' });
        }
        logger.info(`UpdateTextByUser: Text with ID ${id} updated successfully`);
        res.json(updatedText);
    } catch (err) {
        logger.error(`UpdateTextByUser: Error updating text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
};

exports.deleteTextByUser = async (req, res) => {
    const { id } = req.params;
    const user = req.user.displayName; // Assuming user info is available in req.user

    try {
        logger.info(`DeleteTextByUser: Deleting text with ID ${id} for user ${user}`);
        const deletedText = await textModel.deleteTextByUser(id, user);

        if (!deletedText) {
            logger.warn(`DeleteTextByUser: Text with ID ${id} not found or not owned by user ${user}`);
            return res.status(404).json({ error: 'Text not found or not owned by user' });
        }

        logger.info(`DeleteTextByUser: Text with ID ${id} deleted successfully`);
        res.json(deletedText);
    } catch (err) {
        logger.error(`DeleteTextByUser: Error deleting text with ID ${id} - ${err.message}`);
        res.status(500).json({ error: 'Server error', message: err.message });
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

