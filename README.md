# Task Tracker System

**Fr. Conceicao Rodrigues College of Engineering**  
Department of Computer Engineering — Experiment 7

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, Vanilla CSS, JavaScript    |
| Backend  | Node.js, Express.js               |
| Database | MongoDB + Mongoose                |

---

## Project Structure

```
exp7/
├── backend/
│   ├── server.js          ← Express app entry point
│   ├── .env               ← MongoDB URI & PORT (edit this!)
│   ├── models/
│   │   └── Task.js        ← Mongoose schema
│   ├── routes/
│   │   └── tasks.js       ← CRUD route handlers
│   └── package.json
├── frontend/
│   ├── index.html         ← Single-page app
│   ├── style.css          ← Premium dark-mode design
│   └── app.js             ← Fetch-based API logic
└── README.md
```

---

## REST API Endpoints

| Method | Endpoint       | Description         |
|--------|----------------|---------------------|
| POST   | `/tasks`       | Create a new task   |
| GET    | `/tasks`       | Get all tasks       |
| PUT    | `/tasks/:id`   | Update a task       |
| DELETE | `/tasks/:id`   | Delete a task       |

---

## Setup & Run

### 1. Configure MongoDB

Open `backend/.env` and set your MongoDB URI:

```env
# Option A — Local MongoDB
MONGO_URI=mongodb://localhost:27017/tasktracker

# Option B — MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/tasktracker
```

### 2. Install & Start Backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 3. Open Frontend

Simply open `frontend/index.html` in your browser.  
> ⚠️ The backend **must be running** before you open the frontend.

---

## Database Schema

```js
{
  title:       String  (required),
  description: String,
  deadline:    Date,
  status:      String  ('Pending' | 'Completed'),
  createdAt:   Date    (auto),
  updatedAt:   Date    (auto)
}
```
