const textAnalysisController = require('../controllers/textAnalysisController');
const textModel = require('../models/textModel');

jest.mock('../models/textModel'); // Mock the text model

describe('Text Analysis Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('getWordCount should return the word count of a text', async () => {
    const mockText = { id: 1, content: 'Hello World' };
    textModel.getTextById.mockResolvedValue(mockText);

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await textAnalysisController.getWordCount(req, res);

    expect(textModel.getTextById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ wordCount: 2 });
  });

  test('getSentenceCount should return the sentence count of a text', async () => {
    const mockText = { id: 1, content: 'Hello World. How are you?' };
    textModel.getTextById.mockResolvedValue(mockText);
  
    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    await textAnalysisController.getSentenceCount(req, res);
  
    expect(textModel.getTextById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ sentenceCount: 2 });
  });

  test('getCharacterCount should return the character count of a text', async () => {
    const mockText = { id: 1, content: 'Hello World' };
    textModel.getTextById.mockResolvedValue(mockText);

    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await textAnalysisController.getCharacterCount(req, res);

    expect(textModel.getTextById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ characterCount: 10 });
  });
});

test('getParagraphCount should return the paragraph count of a text', async () => {
    const mockText = { id: 1, content: 'Paragraph 1.\n\nParagraph 2.' };
    textModel.getTextById.mockResolvedValue(mockText);
  
    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    await textAnalysisController.getParagraphCount(req, res);
  
    expect(textModel.getTextById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ paragraphCount: 2 });
  });

  test('getLongestWord should return the longest word in a text', async () => {
    const mockText = { id: 1, content: 'The quick brown fox' };
    textModel.getTextById.mockResolvedValue(mockText);
  
    const req = { params: { id: 1 } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  
    await textAnalysisController.getLongestWord(req, res);
  
    expect(textModel.getTextById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ longestWord: 'quick' });
  });