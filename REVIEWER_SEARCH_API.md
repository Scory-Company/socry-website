# Reviewer Search API Documentation

## Base URL
`http://localhost:5000/api/v1/reviewer/search`

>**Note**: Endpoint memerlukan autentikasi dengan role **REVIEWER**.

---

## Endpoints

### 1. Unified Search (Internal + External)
Cari artikel dari database internal Scory dan sumber eksternal (OpenAlex, Google Scholar) secara bersamaan.

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)
- **Query Params**:
  - `q`: (Required) Kata kunci pencarian
  - `page`: (Optional) Halaman ke berapa (default: 1)
  - `limit`: (Optional) Jumlah hasil per halaman (default: 10)
  - `source`: (Optional) `all` | `internal` | `external` (default: `all`)
  - `useScholar`: (Optional) `true` | `false` (default: `false`) - Gunakan Google Scholar sebagai backup
  - `year`: (Optional) Filter tahun publikasi

**Example Request**
```
GET /api/v1/reviewer/search?q=machine+learning&page=1&useScholar=true
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "W2741809807",
        "title": "Deep Learning",
        "excerpt": "Deep learning allows computational models that are composed of multiple processing layers...",
        "authors": ["Yann LeCun", "Yoshua Bengio", "Geoffrey Hinton"],
        "year": 2015,
        "source": "openalex",
        "type": "paper",
        "link": "https://doi.org/10.1038/nature14539",
        "pdfUrl": "https://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf",
        "citations": 50000,
        "isOpenAccess": true,
        "publisher": "Nature",
        "doi": "10.1038/nature14539",
        "isSimplified": false // Menandakan apakah paper ini sudah ada di DB Scory
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Pengantar Machine Learning",
        "excerpt": "Artikel ini membahas dasar-dasar machine learning...",
        "authors": ["Budi Santiko"],
        "year": 2024,
        "source": "internal",
        "type": "article",
        "link": "/articles/pengantar-machine-learning",
        "citations": 0,
        "isSimplified": true,
        "articleId": "550e8400-e29b-41d4-a716-446655440000"
      }
    ],
    "meta": {
      "total": 1250,
      "page": 1,
      "limit": 10,
      "hasMore": true,
      "sources": {
        "internal": 1,
        "openalex": 9,
        "scholar": 0
      },
      "searchTime": "1.2s",
      "scholarUsed": false
    }
  }
}
```

---

## Workflow: Mencari Bahan Simplifikasi

1. **Cari Topik**
   Reviewer mencari topik tertentu, misal "Quantum Computing".
   ```bash
   GET /api/v1/reviewer/search?q=Quantum+Computing
   ```

2. **Cek Hasil**
   Reviewer melihat hasil pencarian.
   - Jika `source: "internal"`, artinya sudah ada di Scory.
   - Jika `source: "openalex"` dan `isSimplified: false`, artinya paper baru yang potensial.

3. **Pilih Paper**
   Jika menemukan paper menarik (External), Reviewer mengambil `pdfUrl` atau `link` (landingPageUrl).

4. **Upload & Simplify** (Gunakan API Simplifikasi)
   Reviewer menggunakan API Simplify untuk memproses paper tersebut.
   ```bash
   POST /api/v1/reviewer/simplify/external
   Body: { 
     "pdfUrl": "...", 
     "landingPageUrl": "...",
     "readingLevel": "SIMPLE" 
   }
   ```
