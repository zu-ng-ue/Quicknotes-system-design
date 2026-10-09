# QuickNotes System Design

## Description
QuickNotes is a scalable note-taking application designed to support 1 million users. This repository contains the frontend API client prototype (using JSONPlaceholder) and the full system design documentation for the backend engineering team.

## How to Run the API Client
1. Clone this repository.
2. Open `index.html` in any modern web browser (or use Live Server in VS Code).
3. Click "Load notes" to fetch data from the mock API.
4. Use the form to create notes and click Delete on existing notes.

## Documentation
- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [Architecture](docs/architecture.md)

## What I Learned
1.  **Asynchronous JavaScript:** I learned how to use `async/await` with `fetch` to make GET, POST, and DELETE requests to a REST API, handling loading and error states gracefully.
2.  **System Design:** I learned how to estimate load for a large-scale application and design an architecture that handles high read traffic using caching and read replicas.
3.  **Database Modeling:** I learned how to design a relational schema with one-to-many and many-to-many relationships, and how to use indexes to optimize query performance.
