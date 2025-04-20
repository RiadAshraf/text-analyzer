const pool = require('../db/db');
const logger = require('../utils/logger'); // Import logger

exports.createText = async (content, user) => {
    try {
        // Validate input
        if (!content || !user) {
            logger.warn('DB: CreateText - Missing content or user in input');
            throw new Error('Content and user are required');
        }

        // Check if content is too long
        if (content.length > 5000) {
            logger.warn('DB: CreateText - Content exceeds maximum length');
            throw new Error('Content is too long');
        }

        logger.info('DB: CreateText - Inserting new text into the database');
        const result = await pool.query(
            `INSERT INTO texts (content, "user") VALUES ($1, $2) RETURNING *`,
            [content, user]
        );
        logger.info(`DB: CreateText - New text created with ID ${result.rows[0].id}`);
        return result.rows[0];
    } catch (err) {
        logger.error(`DB: CreateText - Error creating text - ${err.message}`);
        throw err;
    }
};

exports.getAllTexts = async () => {
    try {
        logger.info('DB: GetAllTexts - Fetching all texts from the database');
        const result = await pool.query('SELECT * FROM texts');
        logger.info(`DB: GetAllTexts - Fetched ${result.rows.length} texts`);
        return result.rows;
    } catch (err) {
        logger.error(`DB: GetAllTexts - Error fetching texts - ${err.message}`);
        throw err;
    }
};

exports.getAllTextsByUser = async (user, limit, offset) => {
    try {
        logger.info(`DB: GetAllTextsByUser - Fetching texts for user ${user}`);
        const result = await pool.query(
            `SELECT * FROM texts ORDER BY id DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM texts`
        );

        return {
            rows: result.rows,
            rowCount: parseInt(totalResult.rows[0].count, 10),
        };
    } catch (err) {
        logger.error('DB: GetAllTextsByUser - Error fetching texts:', err);
        throw err;
    }
};

exports.getTextById = async (id) => {
    try {
        logger.info(`DB: GetTextById - Fetching text with ID ${id}`);
        const result = await pool.query('SELECT * FROM texts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            logger.warn(`DB: GetTextById - Text with ID ${id} not found`);
            return null;
        }
        logger.info(`DB: GetTextById - Text with ID ${id} retrieved successfully`);
        return result.rows[0];
    } catch (err) {
        logger.error(`DB: GetTextById - Error fetching text with ID ${id} - ${err.message}`);
        throw err;
    }
};

exports.updateText = async (id, content) => {
    try {
        logger.info(`DB: UpdateText - Updating text with ID ${id}`);
        const result = await pool.query(
            'UPDATE texts SET content = $1 WHERE id = $2 RETURNING *',
            [content, id]
        );
        if (result.rows.length === 0) {
            logger.warn(`DB: UpdateText - Text with ID ${id} not found`);
            return null;
        }
        logger.info(`DB: UpdateText - Text with ID ${id} updated successfully`);
        return result.rows[0];
    } catch (err) {
        logger.error(`DB: UpdateText - Error updating text with ID ${id} - ${err.message}`);
        throw err;
    }
};

exports.deleteText = async (id) => {
    try {
        logger.info(`DB: DeleteText - Deleting text with ID ${id}`);
        const result = await pool.query(
            'DELETE FROM texts WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            logger.warn(`DB: DeleteText - Text with ID ${id} not found`);
            return null;
        }
        logger.info(`DB: DeleteText - Text with ID ${id} deleted successfully`);
        return result.rows[0];
    } catch (err) {
        logger.error(`DB: DeleteText - Error deleting text with ID ${id} - ${err.message}`);
        throw err;
    }
};

exports.deleteTextByUser = async (id, user) => {
    try {
        logger.info(`DB: DeleteTextByUser - Deleting text with ID ${id} for user ${user}`);
        const result = await pool.query(
            'DELETE FROM texts WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            logger.warn(`DB: DeleteTextByUser - Text with ID ${id} not found or not owned by user ${user}`);
            return null;
        }

        logger.info(`DB: DeleteTextByUser - Text with ID ${id} deleted successfully`);
        return result.rows[0];
    } catch (err) {
        logger.error(`DB: DeleteTextByUser - Error deleting text with ID ${id} - ${err.message}`);
        throw err;
    }
};