# ElderNest

ElderNest is a comprehensive platform designed to connect families and patients with verified, professional caregivers. It streamlines the process of finding, booking, and managing home care services, ensuring peace of mind for families and reliable opportunities for care professionals.

## 🌟 Key Features

### For Families & Patients
- **Find Caregivers:** Browse through a network of verified caregivers based on specialized services (Nursing, Attendant, Physiotherapy).
- **Flexible Bookings:** Schedule care on an hourly, part-time, full-time, or live-in basis.
- **Secure Payments:** Integrated with Razorpay for safe and seamless transactions.
- **Real-Time Messaging:** Communicate directly with caregivers to discuss specific needs and updates.
- **Reviews & Ratings:** Leave feedback to help maintain a high-quality community of caregivers.
- **Automated Invoices:** Instantly receive PDF booking summaries and payment receipts.

### For Caregivers
- **Professional Profiles:** Build a detailed profile showcasing experience, skills, and availability.
- **Booking Management:** easily view, accept, or decline upcoming booking requests.
- **Earnings Dashboard:** Track monthly earnings, pending payouts, and completed jobs.
- **Secure Payouts:** Automated payout processing directly to your bank account via the platform.

### For Administrators
- **Caregiver Verification:** Robust onboarding flow to review and approve caregiver credentials and identity.
- **Financial Management:** Monitor platform revenue, manage user refunds, and process caregiver payouts.
- **Dispute Resolution:** Built-in complaint and contact management systems to assist users.
- **Analytics & Insights:** Monitor overall platform health, active bookings, and user growth.

## 💻 Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** for responsive and modern styling
- **Framer Motion** for smooth UI animations
- **Lucide React** for beautiful icons
- **Axios** for API requests
- **React Router** for seamless navigation

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** for data modeling
- **JWT** for secure Authentication & Authorization
- **Razorpay** for payment gateway integration
- **Puppeteer/PDFKit** for automated PDF generation
- **Socket.io** (or similar) for real-time messaging and notifications

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URL)
- Razorpay API Keys

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FenilKhatri/ElderNest.git
   cd ElderNest
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory and add your frontend environment variables (e.g., `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`).

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Application:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).

## 📁 Project Structure

```
ElderNest/
├── backend/
│   ├── common/         # Shared utilities, constants, and helpers
│   ├── modules/        # Domain-driven modules (auth, booking, admin, payment, etc.)
│   ├── routes/         # API routes for modules
│   └── app.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── animations/ # Framer motion variants
    │   ├── app/        # Main application entry point
    │   ├── assets/     # Static assets
    │   ├── components/ # Reusable UI components
    │   ├── constants/  # Global options and status constants
    │   ├── context/    # React context (Auth, Notifications)
    │   ├── data/       # API integration
    │   ├── features/   # Feature-based architecture (admin, caregiver, user, public)
    │   ├── layout/     # Page layouts and wrappers
    │   ├── lib/        # API and firebase
    │   └── utils/      # Utility functions
    └── package.json
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the MIT License.
