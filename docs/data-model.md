# QuickNotes Data Model

## Entities and Relationships

### 1. Users
- **id** (INTEGER, Primary Key)
- **username** (VARCHAR, Not Null)
- **email** (VARCHAR, Unique, Not Null)

### 2. Notes
- **id** (INTEGER, Primary Key)
- **user_id** (INTEGER, Foreign Key referencing Users.id)
- **title** (VARCHAR, Not Null)
- **body** (TEXT)
- **created_at** (TIMESTAMP)

### 3. Tags
- **id** (INTEGER, Primary Key)
- **name** (VARCHAR, Unique, Not Null)

### 4. Note_Tags (Join Table)
- **note_id** (INTEGER, Foreign Key referencing Notes.id)
- **tag_id** (INTEGER, Foreign Key referencing Tags.id)
- Primary Key is a composite of (note_id, tag_id).

## Relationships
- **One-to-Many:** A User can have many Notes, but a Note belongs to one User.
- **Many-to-Many:** A Note can have many Tags, and a Tag can belong to many Notes. The `note_tags` join table is needed to link these two entities.

## SQL Schema

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE note_tags (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
