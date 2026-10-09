# QuickNotes API Design

## Endpoints

| Method | Path | Description | Success Status |
| :--- | :--- | :--- | :--- |
| GET | `/notes` | List all notes for the authenticated user | 200 OK |
| GET | `/notes/:id` | Get a single note by ID | 200 OK |
| POST | `/notes` | Create a new note | 201 Created |
| PUT | `/notes/:id` | Update an existing note | 200 OK |
| DELETE | `/notes/:id` | Delete a note | 204 No Content |
| GET | `/notes?tag=:tagName` | List notes filtered by a specific tag | 200 OK |

## Request and Response Examples

### Create a Note (POST /notes)
**Request Body:**
```json
{
  "title": "Meeting Notes",
  "body": "Discuss Q4 roadmap.",
  "tags": ["work", "important"]
}
