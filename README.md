# Signature Connect - Inventory Tracking App

A mobile-first Progressive Web Application (PWA) for Signature Connect staff to track inventory movements, scan QR codes, and automatically log transactions to Google Sheets.

## Project Structure

```
.
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Screen components
│   │   ├── utils/           # API, Auth, Constants
│   │   ├── App.jsx          # Main app component with routing
│   │   └── index.js         # React entry point
│   ├── public/
│   │   └── index.html       # HTML template
│   └── package.json
│
├── backend/                  # Node.js/Express backend
│   ├── server.js           # Main server file
│   ├── routes/             # API routes
│   └── package.json
│
├── PRD.md                  # Original product requirements document
└── README.md               # This file
```

## Features Implemented

### Phase 1 - MVP ✅
- ✅ Mobile-first UI with dark theme design
- ✅ User authentication (Admin & Staff roles)
- ✅ Dashboard with stock overview
- ✅ Product listing & search
- ✅ Issue item flow
- ✅ Return item flow
- ✅ Add new stock flow
- ✅ Responsive design for all screen sizes
- ✅ Toast notifications
- ✅ Bottom navigation

### Phase 2 - Future Enhancements
- [ ] QR code scanning (html5-qrcode integration)
- [ ] QR code generation & batch printing (qrcode library)
- [ ] Google Sheets API integration (googleapis)
- [ ] Offline sync capability
- [ ] Low stock notifications
- [ ] Analytics dashboard
- [ ] Biometric authentication

## Installation & Setup

### Prerequisites
- Node.js v14+ and npm
- Modern web browser (Chrome, Safari, Firefox, Edge)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Demo Credentials

| Role  | Username | Password   |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| Staff | staff    | staff123  |

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation (ready to integrate)
- **Axios** - HTTP client for API calls
- **DM Sans Font** - Design system font
- **CSS-in-JS** - Inline styling for consistency

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## UI/UX Design System

### Colors
- **Accent (#AAEF35)** - Primary action buttons
- **Dark Background (#0F0F0F)** - Main background
- **Dark Cards (#1B1B1B, #252525)** - Card backgrounds
- **Muted Text (#717171)** - Secondary text
- **Status Colors** - Green (In Stock), Orange (In Field/Low), Red (Out/Faulty)

### Components
- **Avatar** - User/product initials in circles
- **Pill** - Filter buttons
- **NavBtn** - Bottom navigation buttons
- **Toast** - Temporary notifications
- **SelectField** - Dropdown menus
- **Dot** - Status indicators

### Responsive Design
- Mobile-first approach (375px mockup frame)
- Optimized for portrait orientation
- Large touch targets (48px minimum height)
- Scrollable content areas within fixed height frame

## Screen Flows

### 1. Login Screen
- Light theme
- Role selection (Admin/Staff)
- Demo credentials display
- Persistent authentication via localStorage

### 2. Dashboard
- Stock overview cards
- Recently activity timeline
- Quick access to all features
- Bottom navigation for main screens

### 3. Products
- Full product inventory
- Search functionality
- Status indicators
- Stock quantity display
- Tap to view details

### 4. Product Detail
- Comprehensive product information
- Serial number and category
- Current status with color indicator
- Quick actions (Issue, Return, Mark Faulty)
- QR code preview

### 5. Issue Item
- Auto-filled product information
- Category selection
- Quantity adjustment
- Staff selection dropdowns
- Optional customer name
- Submit to log to Sheets

### 6. Return Item
- Auto-filled product information
- Staff selection for returned/received by
- Condition selection (Good/Faulty/Damaged/etc)
- Warning alert for faulty items
- Submit to log to Sheets

### 7. Add New Stock
- Product selection
- Quantity input
- Serial numbers comma-separated
- Received by selection
- Condition selection
- QR code generation

## API Endpoints (Implemented)

### Authentication
- `POST /api/auth/login` - User login with role

### Sheets Management
- `GET /api/sheets/products` - Fetch all products
- `POST /api/sheets/issue` - Log item issue
- `POST /api/sheets/return` - Log item return
- `POST /api/sheets/stock` - Add new stock
- `GET /api/sheets/transactions` - Get transaction history

### QR Codes
- `POST /api/qr/generate` - Generate single QR code
- `POST /api/qr/batch` - Generate batch QR codes

## Google Sheets Integration (Phase 2)

To enable Google Sheets integration:

1. Create a Google Cloud project and enable Sheets API
2. Create a service account and download credentials JSON
3. Share your Signature Connect sheet with the service account email
4. Add credentials path to `.env`
5. Uncomment and implement the sheets integration in `backend/server.js`

## Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design (primary breakpoint: 375px)
- Adaptive layouts for tablets (responsive fallback)
- Touch-friendly interface with 48px+ buttons
- Optimized scrolling and overflow handling
- Portrait orientation optimization
- Safe area considerations for notched devices

## Security Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **JWT Secret** - Change `JWT_SECRET` in production
3. **Google Credentials** - Keep service account JSON secure
4. **CORS** - Configure allowed origins in production
5. **Authentication** - Implement proper auth in production (not simple password)

## Performance Optimizations

- Minimal dependencies for fast load
- Inline styles prevent CSS bundle size increase
- Local storage for session persistence
- Efficient component re-renders
- No external CSS frameworks (custom inline styling)

## Browser Support

- Chrome/Edge (v90+)
- Safari (v14+)
- Firefox (v88+)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Frontend doesn't connect to Backend
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend
- Verify CORS settings in `backend/server.js`

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Module not found errors
- Delete `node_modules` and run `npm install` again
- Ensure you're in the correct directory

## Development Workflow

1. Make changes to frontend or backend
2. Frontend: Changes auto-reload in development server
3. Backend: Use `npm run dev` for auto-reload with nodemon
4. Test on actual device using mobile browser (for responsive testing)

## Next Steps

1. **QR Code Integration**: Install `html5-qrcode` and implement scanning
2. **Google Sheets API**: Complete googleapis integration in backend
3. **Data Persistence**: Connect all forms to actual Google Sheets
4. **PWA Features**: Add service worker for offline functionality
5. **Testing**: Add Jest tests for components and API endpoints
6. **Deployment**: Setup CI/CD pipeline (GitHub Actions, Vercel, Heroku)

## Support & Contact

For issues or questions, refer to the PRD.md document for detailed requirements and feature specifications.

---

**Last Updated**: April 2026
**Status**: MVP Ready for Development
