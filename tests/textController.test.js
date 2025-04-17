const request = require('supertest');
const express = require('express');
const textController = require('../controllers/textController');
const textModel = require('../models/textModel');

jest.mock('../models/textModel');

const app = express();
app.use(express.json());
app.post('/texts', textController.createText);
app.get('/texts', textController.getAllTexts);
app.get('/texts/:id', textController.getText);
app.put('/texts/:id', textController.updateText);
app.delete('/texts/:id', textController.deleteText);

describe('Text Controller', () => {
    describe('POST /texts', () => {
        it('should create a new text', async () => {
            const mockText = { id: 1, content: 'Test content', user: 'Test user' };
            textModel.createText.mockResolvedValue(mockText);

            const response = await request(app)
                .post('/texts')
                .send({ content: 'Test content', user: 'Test user' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockText);
        });

        it('should return 400 if content or user is missing', async () => {
            const response = await request(app).post('/texts').send({ content: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Content and user are required');
        });

        it('should return 400 if content is too long', async () => {
            const longContent = 'a'.repeat(5001);
            const response = await request(app)
                .post('/texts')
                .send({ content: longContent, user: 'Test user' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Content is too long');
        });
    });

    describe('GET /texts', () => {
        it('should return all texts', async () => {
            const mockTexts = [{ id: 1, content: 'Test content', user: 'Test user' }];
            textModel.getAllTexts.mockResolvedValue(mockTexts);

            const response = await request(app).get('/texts');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTexts);
        });
    });

    describe('GET /texts/:id', () => {
        it('should return a text by ID', async () => {
            const mockText = { id: 1, content: 'Test content', user: 'Test user' };
            textModel.getTextById.mockResolvedValue(mockText);

            const response = await request(app).get('/texts/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockText);
        });

        it('should return 404 if text is not found', async () => {
            textModel.getTextById.mockResolvedValue(null);

            const response = await request(app).get('/texts/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Not found');
        });
    });

    describe('PUT /texts/:id', () => {
        it('should update a text', async () => {
            const mockUpdatedText = { id: 1, content: 'Updated content', user: 'Test user' };
            textModel.updateText.mockResolvedValue(mockUpdatedText);

            const response = await request(app)
                .put('/texts/1')
                .send({ content: 'Updated content' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUpdatedText);
        });

        it('should return 404 if text is not found', async () => {
            textModel.updateText.mockResolvedValue(null);

            const response = await request(app)
                .put('/texts/999')
                .send({ content: 'Updated content' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Not found');
        });
    });

    describe('DELETE /texts/:id', () => {
        it('should delete a text', async () => {
            const mockDeletedText = { id: 1, content: 'Deleted content', user: 'Test user' };
            textModel.deleteText.mockResolvedValue(mockDeletedText);

            const response = await request(app).delete('/texts/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDeletedText);
        });

        it('should return 404 if text is not found', async () => {
            textModel.deleteText.mockResolvedValue(null);

            const response = await request(app).delete('/texts/999');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Not found');
        });
    });
});