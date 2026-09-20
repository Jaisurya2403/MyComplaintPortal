# MyComplaintPortal — Frontend Web Application

A modern civic grievance portal built with React, Vite, and Tailwind/Vanilla CSS styling.

## 🚀 Environment Configuration

The frontend connects directly to the Spring Boot Microservices Backend via the API Gateway (port `9999`).

### `.env.development`
```env
# API Gateway Base Endpoint
VITE_API_BASE_URL=http://localhost:9999/api
```

---

## 🔑 Default Credentials

- **Super Admin**: `jaisurya7482@gmail.com` / `ksjaisurya`
- **Citizen Test**: `b.karthikeyan1000@gmail.com`

---

## 🏗️ Architecture

- **`src/api/apiClient.js`**: Centralized API client forwarding `Authorization: Bearer <token>` headers to `http://localhost:9999/api`.
- **`src/context/AuthContext.jsx`**: Handles JWT authentication and persistent user state.
- **`src/context/ComplaintContext.jsx`**: Loads and synchronizes complaints, departments, users, and admins directly with Oracle DB microservices.
