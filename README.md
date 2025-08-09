# EDIFICE Realty BD OPC – Website & Admin Panel

## 🌐 Live Links
- **Website:** [https://edificerealtybdopc.com/](https://edificerealtybdopc.com/)
- **Admin Panel:** [https://admin.edificerealtybdopc.com/](https://admin.edificerealtybdopc.com/)

---

## 📖 Project Overview
The **EDIFICE Realty BD OPC** platform is a complete real estate company solution consisting of:

1. **Client Website** – Built with **Next.js** for a high-performance, SEO-friendly, and fully responsive website.
2. **Admin Panel** – Built with **Express.js**, **Mongoose**, and **MongoDB** for managing all dynamic content displayed on the website.

The admin panel enables authorized users to:
- Manage all website sections dynamically.
- Upload and update images via **Cloudinary** or **ImgBB**.
- Add, edit, and delete career postings.
- Control content visibility and ordering.

---

## 🛠️ Tech Stack

### **Frontend (Website)**
- [Next.js](https://nextjs.org/) with `output: 'export'` for static export.
- Tailwind CSS & DaisyUI for modern UI styling.
- AOS (Animate on Scroll) for animations.
- Next.js Image Optimization for better performance.
- Deployed to **cPanel** (Static Hosting).

### **Backend (Admin Panel)**
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) with [Mongoose](https://mongoosejs.com/)
- Cloudinary / ImgBB for image hosting.
- JWT Authentication for secure access.
- Multer for file uploads.
- dotenv, bcrypt, cors for environment variables, encryption, and cross-origin requests.
- Deployed to **cPanel Node.js App** (Passenger).

---

## 📂 Folder Structure

```
root/
├── client/                 # Next.js frontend (Website)
│   ├── public/
│   ├── src/
│   ├── next.config.mjs
│   └── package.json
│
├── server/                 # Express.js backend (Admin Panel)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
```

---

## 📌 Features

### Website
- Fully responsive and SEO-optimized.
- Dynamic content rendering from the backend.
- Career/job listings with detailed pages.

### Admin Panel
- CRUD functionality for sliders, testimonials, and projects.
- Career/job posting management.
- Cloud-based image storage integration.
- Role-based access control for secure management.

---

## 🚀 Deployment Notes
- **Website:** Deployed via static export (`output: 'export'`) to **cPanel**.
- **Admin Panel:** Deployed as a Node.js app using **Passenger** on cPanel.

---

## 📸 Screenshots

### Admin Panel Dashboard
![Admin Panel Dashboard](https://res.cloudinary.com/duloqjxil/image/upload/v1754715940/admin_e8pd4z.png)

---
