# Text Analyzer

A web application that analyzes text for various metrics including word count, character count, sentence count, paragraph count, and longest word. It also allows users to save their texts and access them later.

---

## Features

### Text Analysis:
- Word count
- Character count
- Sentence count
- Paragraph count
- Longest word detection

### User Authentication:
- Google OAuth authentication
- Secure session management

### Text Management:
- Save analyzed texts
- View previous text analyses
- Update saved texts
- Delete saved texts

---

## Prerequisites
- **Node.js** (v14 or higher)
- **PostgreSQL database**
- **Google OAuth credentials**

---

## Installation

1. **Clone the repository:**
  ```bash
  git clone <repository-url>
  cd text-analyzer
  ```

2. **Install dependencies:**
  ```bash
  npm install
  ```

3. **Create a `.env` file** in the root directory with the following variables:
  ```
PORT=5000
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=text_analyzer
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
  ```

4. **Set up the database:**
# Create the database
psql -c "CREATE DATABASE text_analyzer;"

# Run the schema migration
psql -d text_analyzer -f db/schema.sql

---

## Database Schema

The application uses a PostgreSQL database with the following table:

### Texts Table
```sql
CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  user VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Application

1. **Start the server:**
  ```bash
  npm start
  ```

2. **Access the application in your browser:**
  ```
  http://localhost:5000
  ```

---

## API Endpoints

### Authentication
| Method | Endpoint                | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/auth/google`           | Initiates Google OAuth login flow    |
| GET    | `/auth/google/callback`  | Google OAuth callback URL            |
| POST   | `/logout`                | Logs out the current user            |
| GET    | `/api/auth-status`       | Checks if a user is authenticated    |

### Text Analysis
| Method | Endpoint                | Description                          |
|--------|--------------------------|--------------------------------------|
| POST   | `/api/word-count`        | Counts words in provided text        |
| POST   | `/api/character-count`   | Counts characters in provided text   |
| POST   | `/api/sentence-count`    | Counts sentences in provided text    |
| POST   | `/api/paragraph-count`   | Counts paragraphs in provided text   |
| POST   | `/api/longest-word`      | Finds longest word in provided text  |

### Text Management
| Method | Endpoint                  | Description                          |
|--------|----------------------------|--------------------------------------|
| POST   | `/api/texts/create`        | Create and analyze a new text        |
| GET    | `/api/texts-by-user`       | Get all texts for the authenticated user |
| GET    | `/api/texts-by-user/:id`   | Get a specific text by ID            |
| PUT    | `/api/texts-by-user/:id`   | Update a specific text               |
| DELETE | `/api/texts-by-user/:id`   | Delete a specific text               |

---

## Request/Response Examples

### Create and Analyze a Text
**Request:**
```json
{
  "text": "Your sample text here."
}
```

**Response:**
```json
{
  "wordCount": 5,
  "characterCount": 23,
  "sentenceCount": 1,
  "paragraphCount": 1,
  "longestWord": "sample"
}
```

### Get All Texts for the Current User
**Request:**
```http
GET /api/texts-by-user
```

**Response:**
```json
[
  {
   "id": 1,
   "text": "Sample text",
   "analysis": {
    "wordCount": 2,
    "characterCount": 11,
    "sentenceCount": 1,
    "paragraphCount": 1,
    "longestWord": "Sample"
   }
  }
]
```

---

## Testing

Run tests using Jest:
```bash
npm run test
```

---

## Security

This application implements several security measures:
- Google OAuth for authentication
- Session management with secure cookies
- CSRF protection
- Rate limiting for API endpoints
- Input validation for all requests

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## Contact

For questions or feedback, please create an issue in the project repository.