# 🍳 Recipe Finder

<!-- cspell:ignore Oxlint -->
A beautiful, responsive, and interactive Recipe Finder application built with React and Vite. Discover new recipes, search by ingredients or categories, and save your favorites for later!

## ✨ Features

- **🔍 Search & Filter**: Easily search for recipes by name or filter by categories.
- **📖 Recipe Details**: View comprehensive recipe information, including ingredients, instructions, and more.
- **🔖 Bookmarking**: Save your favorite recipes to your personal bookmarks for quick access.
- **🎨 Beautiful UI**: Crafted with modern design principles, utilizing smooth animations with `framer-motion` and crisp icons from `lucide-react`.
- **📱 Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices.
- **⚡ Fast Performance**: Powered by Vite and React for lightning-fast development and optimized production builds.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Linting**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or download the source code.
2. **Navigate to the project directory**:

   ```bash
   cd recipe
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).

### Building for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the production build locally with:

```bash
npm run preview
```

## 📁 Project Structure

```text
recipe/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # Reusable UI components (Navbar, RecipeCard, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components (Home, RecipeDetails, Bookmarks)
│   ├── services/       # API and data fetching logic
│   ├── utils/          # Helper functions
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## 📝 Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app into static files for production.
- `npm run lint`: Runs Oxlint to catch issues in the code.
- `npm run preview`: Locally previews the production build.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
