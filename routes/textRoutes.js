const express = require('express');
const router = express.Router();
const textController = require('../controllers/textController');
const textAnalysisController = require('../controllers/textAnalysisController');


router.get('/', textController.getAllTexts);
router.post('/', textController.createText);
router.get('/:id', textController.getText);
router.put('/:id', textController.updateText);
router.delete('/:id', textController.deleteText);

// Text analysis routes
router.get('/:id/word-count', textAnalysisController.getWordCount);
router.get('/:id/character-count', textAnalysisController.getCharacterCount);
router.get('/:id/sentence-count', textAnalysisController.getSentenceCount);
router.get('/:id/paragraph-count', textAnalysisController.getParagraphCount);
router.get('/:id/longest-word', textAnalysisController.getLongestWord);

// Individual routes for text analysis
router.post('/word-count', textAnalysisController.getWordCount);
router.post('/character-count', textAnalysisController.getCharacterCount);
router.post('/sentence-count', textAnalysisController.getSentenceCount);
router.post('/paragraph-count', textAnalysisController.getParagraphCount);
router.post('/longest-word', textAnalysisController.getLongestWord);


module.exports = router;