# Text Analyzer

Text Analyzer is a simple tool for analyzing text data. It provides various functionalities such as word count, character count, frequency analysis, and more.

## Features

- Word count
- Character count
- Frequency analysis of words
- Sentence count
- Readability score

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/riadashraf/text-analyzer.git
    ```
2. Navigate to the project directory:
    ```bash
    cd text-analyzer
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Start the Application

Run the application locally:
```bash
npm start
```

### API Endpoints

#### 1. **Analyze Text**

**Endpoint:** `/api/analyze`  
**Method:** `POST`  
**Description:** Analyzes the provided text and returns various metrics.

**Request Body:**
```json
{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "wordCount": 100,
  "characterCount": 500,
  "sentenceCount": 10,
  "wordFrequency": {
     "example": 5,
     "text": 3
  },
  "readabilityScore": 8.5
}
```

#### 2. **Get Word Frequency**

**Endpoint:** `/api/word-frequency`  
**Method:** `POST`  
**Description:** Returns the frequency of each word in the provided text.

**Request Body:**
```json
{
  "text": "Your text here"
}
```

**Response:**
```json
{
  "wordFrequency": {
     "example": 5,
     "text": 3
  }
}
```

## Testing

Run tests using:
```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature description"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, please contact [your-email@example.com].