# 🚀 Project Management Web App

## 📌 Introduction
This is a **full-stack Project Management Web App** with a **Kanban-style task tracker** and **real-time team chat**.  
The application allows users to create and manage multiple project boards, add tasks, and collaborate with team members in real-time.  
It's built to provide a modern, single-page application experience for small teams to keep their work organized.

---

## ✨ Features
- **User Authentication**: Secure user registration and login.
- **Dynamic Boards**: Create and view multiple project boards.
- **Kanban Board**: A drag-and-drop interface to manage tasks in "To-Do," "In Progress," and "Done" columns.
- **Task Management**: Create new tasks with titles and descriptions.
- **Real-time Team Chat**: Collaborate with other board members using a live chat feature.
- **Member Management**: Add and manage members on a board.

---

## ⚙️ Technology Stack

### **Client-Side (React)**
- **React** – A JavaScript library for building user interfaces.
- **React Router DOM** – For handling front-end routing.
- **Dnd-kit** – A modern, lightweight, and performant drag-and-drop toolkit for React.
- **Axios** – For making API calls to the back end.
- **Socket.io-client** – For establishing a real-time WebSocket connection for the chat feature.
- **Vite** – A build tool that provides a fast development experience.

### **Server-Side (Node.js & Express)**
- **Node.js** – A JavaScript runtime for the server.
- **Express** – A web framework for building REST APIs.
- **Mongoose** – An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **MongoDB** – A NoSQL database for storing application data.
- **JWT (JSON Web Tokens)** – For secure, token-based user authentication.
- **Bcryptjs** – For hashing user passwords.
- **Socket.io** – For enabling real-time, bidirectional communication on the server.
- **CORS** – Middleware to enable cross-origin resource sharing.
- **Dotenv** – To manage environment variables.

---

## 🖥️ Getting Started

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (locally or a cloud-hosted service like MongoDB Atlas)

### **Setup Instructions**

#### 1️⃣ Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd project-management-app
\`\`\`

#### 2️⃣ Set up the server:
\`\`\`bash
cd server
npm install
\`\`\`

#### 3️⃣ Create a \`.env\` file in the server directory and add:
\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secret_key
\`\`\`

#### 4️⃣ Start the server:
\`\`\`bash
npm start
\`\`\`
The server will run on **http://localhost:5000**

#### 5️⃣ Set up the client:
\`\`\`bash
cd ../client
npm install
\`\`\`

#### 6️⃣ Start the client:
\`\`\`bash
npm run dev
\`\`\`
The client will run on **http://localhost:5173**

---

## 🤝 How to Use
1. Open your browser and navigate to **http://localhost:5173**.
2. **Register** a new user account or **Log in** with an existing one.
3. From the dashboard:
   - Create a new board by entering a name and clicking **"Create Board"**.
4. Click on a board to enter the **Kanban view**.
5. In the Kanban view, you can:
   - Add a new task.
   - Drag and drop tasks between **"To-Do"**, **"In Progress"**, and **"Done"** columns.
   - Use the **"Board Members"** section to add other registered users to the board.
   - Use the **"Team Chat"** to send messages to other members in real-time.
