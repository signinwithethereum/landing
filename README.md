# Sign in with Ethereum - Landing Page

This is the official landing page for Sign in with Ethereum (SIWE), built with Next.js 15, React 19, and Tailwind CSS 4.

## 🚀 Features

- **Modern Design**: Dark theme with accent colors matching SIWE branding
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Built with Next.js 15 and optimized for performance
- **Accessible**: Proper semantic HTML and ARIA attributes
- **SEO Optimized**: Meta tags and structured data for search engines

## 📚 Sections

1. **Header** - Navigation with logo and links
2. **Hero** - Main title and call-to-action buttons
3. **Key Features** - Ethereum logo with feature highlights
4. **How It Works** - Three-step process with mockups
5. **Add To Your App** - Integration options and libraries
6. **Ethereum Identity Stack** - ENS and EFP integration info
7. **Featured Integrations** - Wallets and apps using SIWE
8. **Footer** - Links and contact information

## 🛠️ Development

### Prerequisites

- Node.js 18+ or Bun
- Git

### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/ethereumfollowprotocol/siwe-landing.git
cd siwe-landing
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Start the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Build the application for production
- `bun start` - Start the production server
- `bun lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── KeyFeatures.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── AddToApp.tsx
│   │   ├── EthereumIdentityStack.tsx
│   │   ├── FeaturedIntegrations.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
└── public/
    └── assets/            # Images and icons
        ├── logo.svg
        ├── key.svg
        └── icons/
```

## 🎨 Assets

All visual assets are stored in `/public/assets/` and include:
- SIWE logo and branding
- Ethereum key illustration
- Feature icons
- Integration logos

## 📝 License

This project is part of the Ethereum Follow Protocol and follows the same licensing terms.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📧 Contact

For questions or support, reach out to [contact@ethfollow.xyz](mailto:contact@ethfollow.xyz).
