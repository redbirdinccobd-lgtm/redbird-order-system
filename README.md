# Red Bird International - Order Management System

## Overview

A professional, modular order management and invoice generation system for Red Bird International's garments export business.

### Features

✅ **Shipment Profile Management**
- Create and manage buyer profiles
- Track shipment references and dates
- Store company details and contact information

✅ **Order Management**
- Add multiple products per order
- Automatic price calculations
- Grade tracking (A/B/C)
- Detailed product descriptions

✅ **Professional Invoice Generation**
- Auto-generated from order data
- Red Bird brand letterhead
- QR code for tracking
- PDF-ready styling

✅ **Export Letter Generation**
- Customizable export approval letters
- Compliance documentation
- Professional signature blocks
- Brand header and footer

✅ **Database Management**
- Local browser storage (localStorage)
- JSON data structure
- Easy data export/import
- Order history tracking

✅ **Export Options**
- Print to PDF
- Download as JSON (backup)
- Email-ready HTML

---

## Brand Guidelines

### Logo & Visual Identity
- **Primary Colors**: 
  - Red: #C0272D (energetic, premium)
  - Navy Blue: #0B2545 (trustworthy, corporate)
  - Gold: #E7B76B (luxury, prestige)
  - Maroon: #5C171C (depth, sophistication)

- **Typography**:
  - Headings: Georgia (serif, elegant)
  - Body: Inter, Segoe UI (clean, modern)
  - Code: Fira Code (monospace)

### Design Style
- Premium corporate export company
- Dark backgrounds (luxury feel)
- Gold accents for emphasis
- Clean, professional layouts
- International business aesthetic

---

## Project Structure

```
redbird-order-system/
├── public/
│   ├── index.html              # Main dashboard
│   ├── css/
│   │   ├── styles.css          # Global styles
│   │   ├── dashboard.css       # Dashboard styles
│   │   └── print.css           # Print/PDF styles
│   ├── js/
│   │   ├── app.js              # Main application logic
│   │   ├── database.js         # Data management
│   │   ├── invoice-gen.js      # Invoice generation
│   │   ├── letter-gen.js       # Letter generation
│   │   └── utils.js            # Utility functions
│   └── assets/
│       ├── logo.png
│       └── brand-assets/
├── data/
│   ├── profiles.json           # Buyer profiles
│   ├── orders.json             # Order records
│   ├── invoices.json           # Invoice history
│   └── products.json           # Product catalog
├── templates/
│   ├── invoice-template.html
│   ├── letter-template.html
│   └── email-template.html
├── brand-config.json           # Brand settings
├── README.md                   # Documentation
└── SETUP.md                    # Setup instructions
```

---

## Quick Start

1. Open `public/index.html` in your browser
2. Fill in shipment profile (buyer details)
3. Add products/items
4. Click "Generate Invoice & Letter"
5. Print or export as PDF

---

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (browser) + JSON
- **PDF Export**: Native print functionality + optional jsPDF
- **Design**: Responsive, mobile-first

---

## Future Enhancements

- [ ] Cloud database sync (Firebase/Supabase)
- [ ] Team login & role-based access
- [ ] Email integration (send invoice via email/WhatsApp)
- [ ] Bulk CSV import
- [ ] Financial dashboard & analytics
- [ ] Payment tracking
- [ ] Audit trail & versioning
- [ ] Mobile app

---

## Support

For questions or issues:
- Email: info@redbird-international.com
- Phone: +880 1966-635-888

---

**Red Bird International** © 2026. All rights reserved.
