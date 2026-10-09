# QuickNotes Architecture

## Requirements

### Functional Requirements
- Users can register, log in, and manage their profiles.
- Users can create, read, update, and delete notes.
- Users can add tags to notes and filter notes by tags.
- Notes should sync across devices.

### Non-Functional Requirements
- **Scalability:** Support 1 million registered users.
- **Availability:** 99.9% uptime.
- **Performance:** Read and write API responses under 200ms.
- **Security:** User data must be encrypted in transit and at rest.

## Load Estimates (1 Million Users)
*Assuming 10% daily active users (100,000 DAU) and 10 actions per user per day.*
- **Reads per second:** 100,000 users * 10 reads / 86,400 seconds ≈ **12 reads/sec**
- **Writes per second:** 100,000 users * 2 writes / 86,400 seconds ≈ **3 writes/sec**
- **Storage per year:** 100,000 notes/day * 1 KB = 100 MB/day. 100 MB * 365 = **36.5 GB/year** (Metadata only. Photos/files would be much larger).

## Architecture Diagram (Text)

```text
[Client (Browser/Mobile)]
       |
       v
    [ DNS ]
       |
       v
    [ CDN ] <--- (Caches static assets like HTML/CSS/JS)
       |
       v
[Load Balancer]
   /       \
  v         v
[App Server 1] [App Server 2] <---> [Cache (Redis)]
  \         /
   v       v
[Primary Database] ---> [Read Replica]
       |
       v
[ Object Storage ] <--- [ Worker (Background Jobs) ]
                          ^
                          |
                     [ Queue ]

## Component Explanations
*   **Client:** The user interface running in a browser or mobile app that sends requests to the backend.
*   **DNS:** Resolves the domain name (e.g., api.quicknotes.com) to the IP address of the load balancer.
*   **CDN:** Caches static frontend assets at edge locations to reduce latency and offload traffic from the main servers.
*   **Load Balancer:** Distributes incoming network traffic across multiple app servers to ensure high availability.
*   **App Servers:** Handle business logic, API request routing, and validation.
*   **Cache (Redis):** Stores frequently accessed data (like user sessions or recent notes) in memory to reduce database load.
*   **Primary Database:** The master relational database that handles all write operations.
*   **Read Replica:** A copy of the database that handles read queries to offload the primary database.
*   **Queue:** Buffers asynchronous tasks (like sending email notifications or processing heavy background jobs).
*   **Worker:** Consumes jobs from the queue and executes background tasks.
*   **Object Storage:** Stores large files (like user profile pictures) separately from the database.

## Request Flows

### GET /notes
1. Client sends a GET request to `/notes`.
2. DNS resolves the domain, and the request hits the Load Balancer.
3. Load Balancer forwards the request to an available App Server.
4. App Server checks the Cache. If data exists, returns it immediately.
5. If not in cache, App Server queries the Read Replica database.
6. App Server formats the response, updates the cache, and returns the notes to the client.

### POST /notes
1. Client sends a POST request with note data.
2. Load Balancer routes the request to an App Server.
3. App Server validates the request (e.g., title length).
4. App Server writes the note to the Primary Database.
5. App Server places a message on the Queue for any background tasks (e.g., notifying followers).
6. App Server returns a 201 Created response to the client.

## Trade-offs and SPOFs
*   **Trade-off: Consistency vs. Availability.** By using read replicas, we prioritize availability and read performance. However, this introduces eventual consistency. A user who creates a note might not see it immediately in their feed if their request is routed to a replica that hasn't synced yet.
*   **Trade-off: Cost vs. Performance.** Implementing a CDN and a Redis cache adds infrastructure costs and architectural complexity. However, it is necessary to maintain low latency for 1 million users.
*   **Single Points of Failure (SPOFs):**
    *   *Load Balancer:* Avoided by deploying multiple load balancers in an active-passive or active-active configuration.
    *   *App Servers:* Avoided by running multiple instances behind the load balancer.
    *   *Database:* Avoided by using a Primary-Replica setup. If the Primary fails, a Replica is promoted to Primary.
