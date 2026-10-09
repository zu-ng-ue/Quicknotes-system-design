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
