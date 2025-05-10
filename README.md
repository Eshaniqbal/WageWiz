# WageWiz - Employee Salary Management System

WageWiz is a modern, full-stack web application for managing employee salaries, built with Next.js, TypeScript, and MongoDB. It provides a streamlined interface for tracking salaries, generating reports, and managing employee records.

![WageWiz Dashboard](public/screenshot.png)

## Features

- 📊 **Interactive Dashboard**
  - Real-time salary analytics
  - Department-wise distribution
  - Monthly salary trends
  - Key metrics visualization

- 👥 **Employee Management**
  - Add and manage employee records
  - Track salary history
  - Monitor advance payments
  - Calculate pending balances

- 📝 **Salary Processing**
  - Generate salary slips
  - Export data to CSV
  - Track monthly payments
  - Handle advance payments

- 🔍 **Advanced Search & Filter**
  - Quick search functionality
  - Filter records by department
  - Sort by various parameters
  - Export filtered data

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
  - Recharts for visualizations

- **Backend:**
  - MongoDB Atlas
  - Next.js API Routes
  - TypeScript

- **Features:**
  - Server-side rendering
  - Real-time updates
  - Responsive design
  - Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wagewiz.git
   cd wagewiz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
wagewiz/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
├── public/                 # Static assets
└── package.json
```

## Key Features Implementation

### Salary Management
- Add new employee records
- Update salary information
- Track advance payments
- Generate salary slips

### Analytics Dashboard
- Real-time data visualization
- Department-wise analysis
- Monthly trends
- Export functionality

### Data Export
- CSV export
- PDF salary slips
- Filtered data export
- Custom date range selection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

## Support

For support, email support@wagewiz.com or open an issue in the repository.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add the following:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```

5. Deploy your project

The application will be automatically deployed and you'll get a URL like `https://your-project.vercel.app`

### Environment Variables

For local development, create a `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string
```

For production (Vercel), set the environment variables in the Vercel dashboard.

---

Built with ❤️ by [Your Name]
