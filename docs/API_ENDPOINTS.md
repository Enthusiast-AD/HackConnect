# HackConnect API Documentation

Base URL: `http://localhost:8000`

## 1. General

### Check Health & Connection
- **Endpoint:** `GET /`
- **Description:** Checks the connection to the Appwrite backend.
- **Response:**
  ```json
  {
    "status": "✅ Connected to Appwrite",
    "docs": "http://localhost:8000/docs"
  }
  ```

---

## 2. Authentication (`/api/auth`)

### Register New User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Creates a new user account in Appwrite Auth and a corresponding profile in the Database.
- **Input (Body):**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe",
    "username": "johndoe",
    "role": "participant" // or "organizer"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "User registered",
    "userId": "unique_user_id"
  }
  ```

### Login (Verify)
- **Endpoint:** `POST /api/auth/login`
- **Description:** Verifies that a user exists in the database after client-side login.
- **Input (Body):**
  ```json
  {
    "id": "user_id",
    "email": "user@example.com"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "User verified"
  }
  ```

### Update Profile (Self)
- **Endpoint:** `PUT /api/auth/profile`
- **Description:** Updates the current user's profile fields.
- **Input (Body):**
  ```json
  {
    "user_id": "user_id",
    "bio": "New bio...",
    "skills": ["Python", "FastAPI"],
    "github_url": "https://github.com/...",
    "avatar_url": "https://..."
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "Profile updated"
  }
  ```

### Change Password
- **Endpoint:** `POST /api/auth/change-password`
- **Description:** Updates the user's password.
- **Input (Body):**
  ```json
  {
    "user_id": "user_id",
    "new_password": "new_secure_password"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "Password changed"
  }
  ```

---

## 3. Hackathons (`/api/hackathons`)

### Create Hackathon
- **Endpoint:** `POST /api/hackathons/`
- **Description:** Creates a new hackathon event.
- **Input (Body):**
  ```json
  {
    "name": "AI Hackathon 2024",
    "description": "Build the future of AI...",
    "start_date": "2024-01-01T09:00:00",
    "end_date": "2024-01-03T18:00:00",
    "location": "New York / Online",
    "tags": ["AI", "ML"],
    "organizer_id": "user_id",
    "prize_pool": "10000",
    "mode": "hybrid"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "data": { ...hackathon_document... }
  }
  ```

### Get All Hackathons
- **Endpoint:** `GET /api/hackathons/`
- **Description:** Retrieves a list of all hackathons.
- **Output:**
  ```json
  {
    "success": true,
    "documents": [ ...list_of_hackathons... ]
  }
  ```

### Get Hackathon by ID
- **Endpoint:** `GET /api/hackathons/{hackathon_id}`
- **Description:** Retrieves details of a specific hackathon.
- **Output:**
  ```json
  {
    "success": true,
    "data": { ...hackathon_details... }
  }
  ```

### Get Recommendations
- **Endpoint:** `POST /api/hackathons/recommendations`
- **Description:** Returns hackathons matching the user's tags.
- **Input (Body):** `["AI", "Web3"]` (List of strings)
- **Output:**
  ```json
  {
    "success": true,
    "count": 5,
    "documents": [ ...matching_hackathons... ]
  }
  ```

### Get Hackathon Teams (Organizer)
- **Endpoint:** `GET /api/hackathons/{hackathon_id}/teams`
- **Description:** Retrieves all teams registered for a specific hackathon.
- **Output:**
  ```json
  {
    "success": true,
    "teams": [ ...list_of_teams... ]
  }
  ```

---

## 4. Teams (`/api/teams`)

### Create Team
- **Endpoint:** `POST /api/teams/`
- **Description:** Creates a new team for a hackathon.
- **Input (Body):**
  ```json
  {
    "name": "Code Crusaders",
    "description": "We build cool stuff.",
    "hackathon_id": "hackathon_id",
    "leader_id": "user_id",
    "members": ["user_id"],
    "looking_for": ["Designer"],
    "tech_stack": ["React", "Python"]
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "data": { ...team_document... }
  }
  ```

### List All Teams
- **Endpoint:** `GET /api/teams/`
- **Description:** Lists all teams, enriched with member names.
- **Output:**
  ```json
  {
    "total": 10,
    "documents": [
      {
        ...team_data...,
        "members_enriched": [{ "userId": "...", "name": "..." }]
      }
    ]
  }
  ```

### Join Team (Request)
- **Endpoint:** `POST /api/teams/join`
- **Description:** Sends a request to join a team.
- **Input (Body):**
  ```json
  {
    "team_id": "team_id",
    "user_id": "user_id"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "Join request sent"
  }
  ```

### Approve Join Request
- **Endpoint:** `POST /api/teams/approve`
- **Description:** Team leader approves a member's request.
- **Input (Body):**
  ```json
  {
    "team_id": "team_id",
    "leader_id": "leader_user_id",
    "target_user_id": "requester_user_id"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "Member approved"
  }
  ```

### Reject Join Request
- **Endpoint:** `POST /api/teams/reject`
- **Description:** Team leader rejects a member's request.
- **Input (Body):** Same as Approve.
- **Output:**
  ```json
  {
    "success": true,
    "message": "Request rejected"
  }
  ```

### Leave Team
- **Endpoint:** `POST /api/teams/leave`
- **Description:** User leaves a team. If leader leaves, team is disbanded.
- **Input (Body):**
  ```json
  {
    "team_id": "team_id",
    "user_id": "user_id"
  }
  ```
- **Output:**
  ```json
  {
    "success": true,
    "message": "Left team"
  }
  ```

### Delete Team
- **Endpoint:** `DELETE /api/teams/delete`
- **Description:** Leader deletes the team manually.
- **Input (Body):** Same as Leave.
- **Output:**
  ```json
  {
    "success": true,
    "message": "Team deleted"
  }
  ```

---

## 5. Users (`/api/users`)

### Get User Profile
- **Endpoint:** `GET /api/users/{user_id}`
- **Description:** Retrieves full user profile (combining Auth and Database data).
- **Output:**
  ```json
  {
    "id": "...",
    "username": "...",
    "email": "...",
    "name": "...",
    "role": "...",
    "bio": "...",
    "skills": [],
    "xp": 100,
    ...
  }
  ```

### Update User Profile
- **Endpoint:** `PUT /api/users/{user_id}`
- **Description:** Updates specific fields of a user's profile.
- **Input (Body):** `UserUpdate` schema (partial fields).
- **Output:** Updated User Profile object.

### Get User's Hackathons
- **Endpoint:** `GET /api/users/{user_id}/hackathons`
- **Description:** Retrieves all hackathons the user has participated in, including their team details for each.
- **Output:**
  ```json
  {
    "success": true,
    "hackathons": [
      {
        ...hackathon_details...,
        "my_team": { ...team_details... }
      }
    ]
  }
  ```
