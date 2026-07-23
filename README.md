# Vehicle Inventory System - React + Tailwind Frontend

A modern, responsive Single Page Application (SPA) built with **React**, **Tailwind CSS**, and **Lucide Icons** that connects directly to the FastAPI backend API (`http://127.0.0.1:8000/api`).

---

## Features

- **User Authentication**:
  - Modal registration & login forms.
  - JWT token storage in `localStorage`.
  - Automatic `Authorization: Bearer <token>` header on requests.
- **Vehicle Catalog & Search**:
  - Real-time search by Make & Model.
  - Category dropdown filter (Sedan, SUV, Truck, Coupe, Convertible).
  - Price range filters (`Min Price` & `Max Price`).
- **Inventory & Purchase**:
  - Direct "Purchase" button on each vehicle card.
  - Decrements vehicle stock in real-time.
  - Automatically disabled when `quantity === 0` ("OUT OF STOCK").
- **Admin Control Panel** (For users registered with `role: "admin"`):
  - **Add Vehicle**: Form modal to insert new vehicles into inventory.
  - **Edit Vehicle**: Form modal to update vehicle make, model, price, or category.
  - **Restock Vehicle**: Quick modal to add stock quantity.
  - **Delete Vehicle**: Delete vehicle from database with confirmation dialog.

---

## How to Run the Frontend

Make sure your FastAPI backend is running first at `http://127.0.0.1:8000`.

### Option 1: Zero-Setup Standalone HTML (Immediate Browser Testing)

Simply double click the file [public/index.html](file:///C:/Users/Dell/.gemini/antigravity/scratch/vehicle_inventory_frontend/public/index.html) or open it directly in Google Chrome, Edge, or Firefox!

No Node.js or `npm install` required! It loads React, Tailwind CSS, and Axios directly via CDN.

---

### Option 2: Run via Vite Development Server

1. Open terminal and navigate to the frontend directory:
   ```bash
   cd C:\Users\Dell\.gemini\antigravity\scratch\vehicle_inventory_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
