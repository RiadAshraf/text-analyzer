const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const textAnalysisController = require('../controllers/textAnalysisController');


router.post('/texts/create', textController.createText);
// Route to fetch all texts for the logged-in user with pagination
router.get('/texts-by-user', textController.getAllTextsByUser);
router.put('/texts-by-user/:id', textController.updateTextByUser);
router.delete('/texts-by-user/:id', textController.deleteTextByUser);

// CRUD routes for texts
router.get('/', textController.getAllTexts);

router.get('/:id', textController.getText);
router.put('/:id', textController.updateText);
router.delete('/:id', textController.deleteText);

// Individual routes for text analysis
router.post('/word-count', textAnalysisController.getWordCount);
router.post('/character-count', textAnalysisController.getCharacterCount);
router.post('/sentence-count', textAnalysisController.getSentenceCount);
router.post('/paragraph-count', textAnalysisController.getParagraphCount);
router.post('/longest-word', textAnalysisController.getLongestWord);

module.exports = router;