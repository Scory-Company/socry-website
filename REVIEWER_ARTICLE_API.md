# Reviewer Article API Documentation

## Base URL
`http://localhost:5000/api/v1/reviewer/articles`

>**Note**: Ensure you use the correct port (default is 5000).

## Endpoints

### 1. Get All Articles
Retrieves a paginated list of articles. Reviewers can see both published and unpublished articles.

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `categoryId`: Filter by category UUID (optional)
  - `topicId`: Filter by topic UUID (optional)
  - `isPublished`: Filter by publish status (true/false) (optional)
  - `search`: Search term (optional)

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": "adabb204-ab53-48d1-b831-8047f8cfe190",
      "title": "Impact of Financial Literacy",
      "slug": "impact-of-financial-literacy",
      "excerpt": "A short summary...",
      "categoryId": "cat-uuid-1",
      "authorName": "Dr. Smith",
      "authorAvatar": "https://...",
      "imageUrl": "https://...",
      "readTimeMinutes": 5,
      "rating": 4.5,
      "totalRatings": 12,
      "isPublished": true,
      "isFeatured": false,
      "publishedAt": "2024-01-01T10:00:00.000Z",
      "createdAt": "2023-12-31T10:00:00.000Z",
      "category": {
        "id": "cat-uuid-1",
        "name": "Finance",
        "slug": "finance"
      },
      "topics": [
        {
          "id": "topic-uuid-1",
          "name": "Investment",
          "slug": "investment"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Get Article Detail
Retrieves detailed information about an article, including contents, quizzes, and external references (PDF/DOI).

- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `id`: The UUID of the article.

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": "adabb204-ab53-48d1-b831-8047f8cfe190",
    "title": "Impact of Financial Literacy",
    "slug": "impact-of-financial-literacy",
    "contents": [
      {
        "id": "content-uuid-1",
        "readingLevel": "SIMPLE", // Enum: SIMPLE, STUDENT, ACADEMIC, EXPERT
        "blocks": [
          {
            "type": "paragraph",
            "content": "Financial literacy is important because..."
          }
        ]
      }
    ],
    "quizzes": [
      {
        "id": "quiz-uuid-1",
        "readingLevel": "SIMPLE",
        "question": "What is the main benefit?",
        "options": ["Saving money", "Spending more", "None", "Both"],
        "correctAnswer": "A",
        "explanation": "Saving allows specifically...",
        "order": 1
      }
    ],
    "externalArticle": {
      "id": "ext-uuid-1",
      "doi": "10.1038/s41586-023-01234-x",
      "pdfUrl": "https://example.com/paper.pdf",
      "landingPageUrl": "https://example.com/paper",
      "title": "Original Paper Title",
      "source": "openalex"
    }
    // ...other article fields (same as in Get All)
  }
}
```

### 3. Update Article Metadata
Updates an existing article's basic info (title, category, publish status, etc.).

- **URL**: `/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `id`: The UUID of the article.

**Request Body** (All fields are optional)
```json
{
  "title": "Updated Title",
  "isPublished": true,
  "topicIds": ["new-topic-uuid-1", "new-topic-uuid-2"]
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "id": "adabb204-ab53-48d1-b831-8047f8cfe190",
    // ...updated fields will be reflected here
  }
}
```

### 4. Update Article Content (Blocks)
Updates the reading content (blocks) for a specific reading level.

- **URL**: `/:id/content`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `id`: The UUID of the article.

**Request Body**
```json
{
  "readingLevel": "SIMPLE", // Enum: SIMPLE, STUDENT, ACADEMIC, EXPERT
  "blocks": [
    {
      "type": "paragraph",
      "content": "This is the new simplified content."
    }
  ]
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Article content updated successfully",
  "data": {
    "id": "content-uuid-1",
    "readingLevel": "SIMPLE",
    "blocks": [...] // The updated blocks
  }
}
```

### 5. Update Article Quizzes
Updates the quizzes for a specific article and reading level. **Note**: This replaces all existing quizzes for that reading level.

- **URL**: `/:articleId/quizzes`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `articleId`: The UUID of the article.

**Request Body**
```json
{
  "readingLevel": "SIMPLE", // Enum: SIMPLE, STUDENT, ACADEMIC, EXPERT
  "quizzes": [
    {
      "question": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"], // Text array
      "correctAnswer": "B", // Must be A, B, C, or D corresponding to index 0-3
      "explanation": "Paris is the capital.",
      "order": 1
    }
  ]
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Quizzes updated successfully"
}
```
