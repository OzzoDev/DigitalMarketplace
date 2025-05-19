# 🛍️ Digital Marketplace

A modern digital marketplace built with **Next.js 14**, **TypeScript**, **tRPC**, **Tailwind CSS**, **Payload CMS**, and **Stripe**. This full-stack application allows users to browse, buy, and sell digital products, with secure payments, dynamic content management, and a clean, modern UI.

---

## ✨ Features

- 🔐 **End-to-End Type Safety** with `tRPC`
- ⚡ **App Router & Server Actions** with `Next.js 14`
- 🎨 **Responsive UI** using `Tailwind CSS`
- 🛠️ **Headless CMS** with `Payload CMS` for content and product management
- 💳 **Stripe Integration** for secure payment processing
- 📧 **Transactional Emails** via `Resend`
- ☁️ **Scalable & Extensible Architecture**

---

## 🧱 Tech Stack

| Technology    | Purpose                                      |
|---------------|----------------------------------------------|
| Next.js 14    | React framework with App Router and SSR      |
| TypeScript    | Type safety and better developer experience  |
| tRPC          | Typesafe API communication                   |
| Tailwind CSS  | Utility-first CSS for modern styling         |
| Payload CMS   | Self-hosted CMS with MongoDB                 |
| Stripe        | Secure payments integration                  |
| Resend        | Email sending service (e.g. order receipts)  |

---

## 📁 Project Structure

```

/
├── app/                 # App Router (routes, layouts, pages)
├── components/          # Reusable UI components
├── server/              # tRPC routers and backend logic
├── payload/             # Payload CMS config & collections
├── styles/              # Tailwind config and globals
├── utils/               # Helper functions
├── public/              # Static assets
└── .env.local           # Environment variables

````

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com//OzzoDev/DigitalMarketplace.git
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
# Payload CMS
PAYLOAD_SECRET=your_payload_secret
DATABASE_URI=your_mongodb_connection_string

# App Base URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Resend (Email API)
RESEND_API_KEY=your_resend_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
```

> 🛡️ Keep this file **private** and never commit it to Git.

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to view the application.

> 💡 Make sure MongoDB is running locally or accessible via Atlas, and that Payload CMS has access to it.

## 🧾 License

This project is licensed under the [MIT License](LICENSE).

---

