# Quick Setup Guide

## Installation Commands

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start both frontend and backend in development mode
npm run dev

# Individual commands
npm run backend:dev    # Start backend only
npm run frontend:dev   # Start frontend only
npm run frontend:build # Build frontend for production
```

## Project Structure
```
ecommerce-bidding-platform/
├── frontend/          # React + TypeScript frontend (Port 5173)
├── backend/           # Node.js + Express backend (Port 5000)
├── package.json       # Root package.json with scripts
├── README.md
└── .gitignore
```

## Currency
All prices are displayed in Indian Rupees (₹)
