# Product Inventory Management System

A premium, highly responsive Single Page Application (SPA) designed to manage product inventory. Built with **Angular** (Standalone Components) and integrated with **Cloud Firebase Firestore** for real-time CRUD data persistence.

Developed for Aptech Assignment - Batch: **2412E2** (MWF, 3:00 PM – 5:00 PM).

---

## 🚀 Key Features

* **Real-time Database Connection**: Integrates with Cloud Firestore, automatically syncing data changes instantly.
* **Complete CRUD Operations**:
  * **Create**: Register new products with instant Firestore validation.
  * **Read**: Present products inside a clean glassmorphism table with live loading and stock badges.
  * **Update**: Modal overlay editor with pre-filled form fields.
  * **Delete**: Click-to-confirm modal for safe item deletion.
* **Premium UX/UI Styling**:
  * Clean, futuristic dark-theme interface with glassmorphism panels.
  * Smooth animations, responsive table layouts, and glowing indicators for inventory levels.
* **Dynamic Search & Filtering**:
  * Live search by product name or supplier.
  * Categorization filter dropdown.
  * Stock status selector (In Stock, Low Stock, Out of Stock).
  * Sortable columns by ID, Name, Category, Price, and Quantity.
* **Firebase Error Handling**: Built-in credential validation alerts showing configuration warnings if the connection fails.

---

## 🛠️ Technologies Used

* **Frontend Framework**: Angular (Latest v21+ standalone paradigm)
* **Database & Persistence**: Firebase Web SDK (Cloud Firestore)
* **Styling**: Modern CSS variables, Glassmorphism design tokens, Responsive CSS Grid & Flexbox
* **Icons**: Inline scalable vector graphics (SVGs) for zero dependencies

---

## 💻 Installation & Setup

Follow these steps to run the application locally:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd product-inventory
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Firebase
To connect the application to your Firebase Firestore project, configure your environment details.

1. Open the file `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     }
   };
   ```
2. Replace `"YOUR_API_KEY"`, `"YOUR_PROJECT_ID"`, etc. with your Firebase Web App configuration from your Firebase Console.
3. Save the file.

### 5. Running Locally
Run the Angular development server:
```bash
npm start
```
Once the compilation completes, open your browser and navigate to `http://localhost:4200/`.

### 6. Build for Production
To package the app for production deployment:
```bash
npm run build
```
The compiled output will be written to the `dist/` directory.

---

## ⚙️ Setting up Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and enter a name (e.g., `product-inventory-system`).
3. Under the **Build** menu, click **Firestore Database** and choose **Create Database**.
4. Set Firestore Security Rules to **Test Mode** (or configure secure read/write rules for your products collection).
5. Click **Project Settings** (gear icon) -> **General** -> scroll down to **Your Apps** -> select **Web App** `</>` to register your web application.
6. Copy the `firebaseConfig` keys provided and paste them into `src/environments/environment.ts`.
