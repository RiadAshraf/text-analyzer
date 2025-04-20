const textAnalysisController = require('../controllers/textAnalysisController');
const textModel = require('../models/textModel');

jest.mock('../models/textModel'); // Mock the text model

describe('Text Analysis Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('getWordCount should return the word count of a text', async () => {
    const req = { body: { content: 'Hello World' } }; // Mock req.body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getWordCount(req, res);

    expect(res.json).toHaveBeenCalledWith({ result: 2 });
  });

  test('getSentenceCount should return the sentence count of a text', async () => {
    const req = { body: { content: 'Hello World. How are you?' } }; // Mock req.body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getSentenceCount(req, res);

    expect(res.json).toHaveBeenCalledWith({ result: 2 });
  });

  test('getCharacterCount should return the character count of a text', async () => {
    const req = { body: { content: 'Hello World' } }; // Mock req.body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getCharacterCount(req, res);

    expect(res.json).toHaveBeenCalledWith({ result: 10 }); // Excludes spaces
  });

  test('getParagraphCount should return the paragraph count of a text', async () => {
    const req = { body: { content: 'Paragraph 1.\n\nParagraph 2.' } }; // Mock req.body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getParagraphCount(req, res);

    expect(res.json).toHaveBeenCalledWith({ result: 2 });
  });

  test('getLongestWord should return the longest word in a text', async () => {
    const req = { body: { content: 'The quick brown fox' } }; // Mock req.body
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getLongestWord(req, res);

    expect(res.json).toHaveBeenCalledWith({ result: 'quick' });
  });

  test('getWordCount should return 400 if content is missing', async () => {
    const req = { body: {} }; // Missing content
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    textAnalysisController.getWordCount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Content is required' });
  });
});