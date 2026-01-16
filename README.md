# 🍽️ Recipe Sharing App (MERN)

A full-stack Recipe Sharing platform where users can create recipes, add favorites, rate recipes, and manage their own posts.

---

## 🚀 Features

### ✅ Authentication
- User Signup & Login (JWT)
- Protected routes for user-specific actions
- Password hashing using bcrypt
- **AuthProvider (Context API)** used for authentication flow (login/logout/account fetch)
- Redirect after login using `redirect` query param for better UX

### ✅ Recipes
- Create a recipe
- View all recipes
- View recipe details
- Update/Delete only own recipes
- Search recipes by:
  - Title
  - Ingredients
  - Category

### 🧩 Dynamic Form Inputs (User Friendly)
- Recipe form supports **dynamic inputs**
- User can add/remove fields for:
  - **Ingredients**
  - **Instructions**
- New input fields are created instantly when user clicks **Add (+)**

### ⭐ Ratings
- Users can rate recipes (1–5 stars)
- Users cannot rate their own recipe
- Stores:
  - `ratings[]` (user + value)
  - `avgRating`
  - `ratingsCount`

✅ **Ranking (Most Trusted First)**
- Recipes are ranked by:
  - `ratingsCount` (desc)
  - `avgRating` (desc)

✅ **Aggregation for better performance**
- Rating updates are handled using MongoDB aggregation pipeline update for efficient DB-level computation.

### ❤️ Favorites
- Add/Remove favorites (toggle)
- Fetch all favorite recipes

### 🧾 My Posts
- Fetch recipes created by logged-in user

### 🔍 Search + Filter + Redirect Improvements
- **Live Search Results** implemented using debouncing (prevents too many API calls while typing)
- **Search Query + Category Filter** handled using a single search API (`/recipes/search?q=...`)
- **Filter state stored in URL** using `useSearchParams()` so filters are shareable via link
- After refresh, recipes are fetched again based on **URL query filter** (state is not lost)

### 🔐 Redirect After Login (Better UX)
- If a user tries to open **Recipe Details** without login, they are redirected to:
  - `/login?redirect=/recipes/:id`
- After successful login, user is automatically redirected back to the same **Recipe Details page** they were trying to access

### 📝 Draft Save (Frontend)
- Recipe form auto-saves in `localStorage`
- Draft remains after refresh until submitted
- Clear Draft button available
- Draft is cleared on logout (prevents draft showing for other users)

---

## 🧠 State Management
- **Context API (AuthProvider)** → Authentication & user session data
- **Redux Toolkit** → Recipes, MyPosts, search/filter, rating updates, global data state

---

## 🛡️ Transactions (Atomic Operations)
MongoDB transactions are used for atomic operations, such as:
- Deleting user account
- Deleting all recipes created by that user
- Removing deleted recipes from other users' favorites safely

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Formik + Joi validation
- react-simple-star-rating
- react-toastify

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation
- bcrypt
- MongoDB Aggregation Pipeline
- Mongoose Transactions

---

## 📦 Installation

### ✅ Clone Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
🔧 Backend Setup
Install dependencies
bash
Copy code
cd backend
npm install
Create .env file in backend
env
Copy code
PORT=8080
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
Start backend server
bash
Copy code
npm run dev
Backend runs on:
✅ http://localhost:8080

🎨 Frontend Setup
Install dependencies
bash
Copy code
cd frontend
npm install
Start frontend server
bash
Copy code
npm run dev
Frontend runs on:
✅ http://localhost:5173

🔑 API Documentation
Base URL: http://localhost:8080

✅ Auth Routes
Signup
POST /signup

Body

json
{
  "username": "Vivek",
  "email": "vivek@gmail.com",
  "password": "123456"
}
Login
POST /login

Body

json
{
  "email": "vivek@gmail.com",
  "password": "123456"
}
✅ Response

json
{
  "token": "JWT_TOKEN"
}
✅ User Routes (Protected)
Send token in headers:

json
{
  "Authorization": "JWT_TOKEN"
}
Get Account
GET /user/account

Update User
PUT /user/update

Delete Account + all recipes (Transactional)
DELETE /user/delete

Get My Posts
GET /user/myposts

Get Favorites
GET /user/favorites

Add/Remove Favorite (Toggle)
PUT /user/favorites/:id

✅ Recipe Routes
Get all recipes (Ranked by Trust)
GET /recipes

✅ Default Sorting: Most Trusted First

ratingsCount (desc)

avgRating (desc)

Search Recipes
GET /recipes/search?q=Lunch

Create Recipe (Protected)
POST /recipes

Get One Recipe
GET /recipes/:id

Update Recipe (Protected)
PUT /recipes/:id

Delete Recipe (Protected + Transactional cleanup)
DELETE /recipes/:id

Rate Recipe (Protected + Aggregation Pipeline)
PUT /recipes/:id/rating

Body

json
{
  "value": 4
}
✅ Sorting Logic (Most Trusted First)
Recipes are ranked using:

js
.sort({ ratingsCount: -1, avgRating: -1 })

👤 Author
Vivek Chavan
