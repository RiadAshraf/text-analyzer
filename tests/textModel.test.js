const textModel = require('../models/textModel');
const pool = require('../db/db');

jest.mock('../db/db'); // Mock the database connection

describe('Text Model', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('createText should insert a new text into the database', async () => {
    const mockText = { content: 'Hello World', user: 'user123' };
    const mockResult = { rows: [{ id: 1, ...mockText }] };

    pool.query.mockResolvedValue(mockResult);

    const result = await textModel.createText(mockText.content, mockText.user);
    expect(pool.query).toHaveBeenCalledWith(
      `INSERT INTO texts (content, "user") VALUES ($1, $2) RETURNING *`,
      [mockText.content, mockText.user]
    );
    expect(result).toEqual(mockResult.rows[0]);
  });

  test('getAllTexts should fetch all texts from the database', async () => {
    const mockTexts = [
      { id: 1, content: 'Hello World', user: 'user123' },
      { id: 2, content: 'Another text', user: 'user456' },
    ];

    pool.query.mockResolvedValue({ rows: mockTexts });

    const result = await textModel.getAllTexts();
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM texts');
    expect(result).toEqual(mockTexts);
  });
});