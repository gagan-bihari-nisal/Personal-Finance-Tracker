# Personal Finance Tracker 💰

A full-stack web application to help users track income, expenses, savings, and budgets with interactive charts and detailed analytics. Built using a microservices architecture with Spring Boot backend and a modern React frontend.

---

## ✨ Features

- User registration and login with JWT-based authentication
- CRUD operations for financial transactions (income/expenses)
- Set and manage monthly budgets
- Visualize income, expenses, savings, top expenses, and budget utilization via dynamic charts
- Email notifications via Kafka-based messaging
- Responsive UI built with React, Vite, and Tailwind CSS
- Dockerized microservices for easy deployment

---

## 🛠️ Tech Stack

### Backend
- Java, Spring Boot
- Microservices architecture
- Spring Security (JWT authentication)
- JPA/Hibernate (Database interaction)
- Apache Kafka (Email notifications)
- MySQL (or your preferred RDBMS)
- Docker (Containerization)

### Frontend
- React
- Vite
- Tailwind CSS

### Tools
- Postman (API testing)
- Git/GitHub (Version control)

---

## 📦 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+
- Vite v5
- Tailwind CSS v3
- Docker & Docker Compose
- MySQL (or use Dockerized DB)

### 1. Clone the Repository
```bash
git clone https://github.com/gagan-bihari-nisal/Personal-Finance-Tracker.git
```
### 2. Backend Setup
```bash
cd Backend
docker-compose up --build
```
### 3. Frontend Setup (port: 3000)
```bash
cd Frontend
npm run dev
```