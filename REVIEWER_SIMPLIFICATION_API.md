# Reviewer Simplification API Documentation

## Base URL
`http://localhost:5000/api/v1/reviewer/simplify`

>**Note**: Semua endpoint memerlukan autentikasi dengan role **REVIEWER**.

---

## Endpoints

### 0. Upload Local PDF (Helper)
Upload file PDF dari komputer lokal untuk mendapatkan URL public. Gunakan URL ini untuk endpoint simplification di bawah.

- **URL**: `/api/v1/upload/pdf`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Auth Required**: Yes (Bearer Token)

**Request Body**
- `file`: File PDF binary (Max 50MB)

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "PDF uploaded successfully",
  "data": {
    "url": "https://supabase-project.co/storage/v1/object/public/article-pdfs/papers/abc-123.pdf",
    "path": "papers/abc-123.pdf"
  }
}
```

---

### 1. Simplify External Paper (Upload PDF URL)
Upload dan simplify paper akademik dari URL (bisa dari hasil upload endpoint di atas atau URL eksternal).

- **URL**: `/external`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **Rate Limit**: 
  - Max 3 concurrent jobs
  - Max 30 jobs per day
  - Max 20 AI requests per hour

**Request Body**
```json
{
  "externalId": "W2741809807",
  "source": "openalex",
  "title": "Deep Learning for Computer Vision",
  "authors": ["Alice Johnson", "Bob Williams"],
  "year": 2023,
  "abstract": "This paper presents...",
  "pdfUrl": "https://arxiv.org/pdf/1234.5678.pdf",
  "landingPageUrl": "https://doi.org/10.1234/example",
  "doi": "10.1234/example",
  "readingLevel": "SIMPLE",
  "categoryName": "Technology"
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Paper simplified successfully",
  "data": {
    "articleId": "uuid-article-123",
    "isNewSimplification": true,
    "isCached": false,
    "content": [
      {
        "type": "heading",
        "data": { "level": 1, "text": "Judul Artikel" }
      },
      {
        "type": "text",
        "data": { "text": "Konten..." }
      }
    ],
    "quiz": [
      {
        "question": "Pertanyaan 1?",
        "options": ["A", "B", "C"],
        "correctAnswer": "A",
        "explanation": "Penjelasan..."
      }
    ],
    "metadata": {
      "extractionMethod": "pdf",
      "aiCost": 0.25,
      "processingTime": 12500,
      "readingLevel": "SIMPLE"
    }
  }
}
```

---

### 2. Re-simplify Article (Ganti Reading Level)
Re-generate konten artikel ke reading level berbeda. Berguna jika hasil simplify dari search kurang optimal.

- **URL**: `/:articleId/resimplify`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `articleId`: UUID artikel yang ingin di-resimplify

**Request Body**
```json
{
  "readingLevel": "STUDENT",
  "pdfUrl": "https://..." // Optional: Jika ingin mengganti PDF source (misal dari upload)
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Article re-simplified successfully",
  "data": {
    "articleId": "uuid-article-123",
    "isNewSimplification": true,
    "isCached": false,
    "content": [...],
    "quiz": [...],
    "metadata": {
      "extractionMethod": "pdf",
      "aiCost": 0.25,
      "processingTime": 25000,
      "readingLevel": "STUDENT"
    }
  }
}
```

---

### 3. Get Simplified Article
Ambil artikel yang sudah di-simplify berdasarkan ID dan reading level.

- **URL**: `/:articleId`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **URL Params**:
  - `articleId`: UUID artikel
- **Query Params**:
  - `readingLevel`: (Optional) SIMPLE | STUDENT | ACADEMIC | EXPERT
  - `includeQuiz`: (Optional) true | false (default: false)

**Example Request**
```
GET /api/v1/reviewer/simplify/uuid-article-123?readingLevel=SIMPLE&includeQuiz=true
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "article": {
      "id": "uuid-article-123",
      "title": "Deep Learning for Computer Vision",
      "slug": "deep-learning-for-computer-vision",
      "isPublished": true
    },
    "content": [
      {
        "type": "heading",
        "data": { "level": 1, "text": "Judul" }
      }
    ],
    "quiz": [
      {
        "question": "Pertanyaan?",
        "options": ["A", "B", "C"],
        "correctAnswer": "A",
        "explanation": "..."
      }
    ],
    "externalMetadata": {
      "source": "openalex",
      "externalId": "W2741809807",
      "doi": "10.1234/example",
      "pdfUrl": "https://arxiv.org/pdf/1234.5678.pdf",
      "extractionMethod": "pdf"
    },
    "readingLevel": "SIMPLE"
  }
}
```

---

## Reading Levels

| Level | Target Audience | Karakteristik |
|-------|----------------|---------------|
| **SIMPLE** | Umum, Siswa SMA (13+) | Bahasa santai, tanpa jargon |
| **STUDENT** | Mahasiswa S1 | Semi-formal, istilah teknis dijelaskan |
| **ACADEMIC** | Mahasiswa S2/S3 | Formal, detail metodologi |
| **EXPERT** | Profesor, Ahli | Sangat teknis, evaluasi kritis |

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Reviewer access required"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded. Max 3 concurrent jobs or 30 jobs per day."
}
```

---

## Workflow: Upload PDF Local → Simplify → Edit

1. **Upload Local PDF**
   ```bash
   POST /api/v1/upload/pdf
   Form-Data: { file: "paper.pdf" }
   Response: { "data": { "url": "https://..." } }
   ```

2. **Simplify Paper**
   ```bash
   POST /api/v1/reviewer/simplify/external
   Body: { 
     "pdfUrl": "https://...", 
     "title": "Judul Paper", 
     "readingLevel": "SIMPLE" 
   }
   ```

3. **Dapatkan Article ID** dari response
   ```json
   { "data": { "articleId": "uuid-123" } }
   ```

4. **Edit Content** (jika perlu)
   ```bash
   PUT /api/v1/reviewer/articles/uuid-123/content
   Body: { "readingLevel": "SIMPLE", "blocks": [...] }
   ```

5. **Re-simplify** (jika hasil kurang optimal ATAU ingin ganti PDF)
   ```bash
   POST /api/v1/reviewer/simplify/uuid-123/resimplify
   Body: { 
     "readingLevel": "STUDENT",
     "pdfUrl": "https://..." // Opsional: URL PDF baru dari langkah 1
   }
   ```

