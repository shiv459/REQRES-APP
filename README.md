# React + Vite
# User Management App

A React-based user management system with authentication, user listing, editing, and deletion.

## 🚀 Features
✅ User authentication (login)  
✅ Fetch and display paginated users  
✅ Edit user details  
✅ Delete users  
✅ Logout functionality  

## 📌 Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/shiv459/REQRES-APP

   Navigate to the project directory
   cd user-management-app


   Install dependencies
   npm install

   Start the application
   npm run dev


   
🛠️ Tech Stack
React.js

Tailwind CSS

Axios

React Router

📌 API Endpoints Used
POST /api/login → Authenticate user

GET /api/users?page=1 → Fetch users

PUT /api/users/{id} → Edit user details

DELETE /api/users/{id} → Remove user

📜 Assumptions & Considerations
Uses Reqres API for testing

Token is stored in localStorage for session management

Pagination is implemented with page query params


