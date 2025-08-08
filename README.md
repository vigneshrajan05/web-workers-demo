# Customer Data Analyzer

A React + TypeScript application built with Vite that allows users to upload and analyze large JSON files containing customer records.

## Features

- **File Upload**: Drag and drop or click to upload JSON files (5MB+)
- **Data Validation**: Validates each customer record for required fields (id, name, email, country)
- **Statistics Dashboard**: Shows total, valid, and invalid record counts
- **Country Analysis**: Displays top 5 most common countries with visual progress bars
- **Paginated Table**: Displays customer data in a clean, paginated table (100 records per page)
- **Responsive Design**: Modern UI built with Tailwind CSS

## Customer Record Structure

Each customer record should have the following fields:

```json
{
  "id": "string",
  "name": "string", 
  "email": "string",
  "country": "string"
}
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

1. Open the application in your browser
2. Upload a JSON file containing an array of customer records
3. The application will automatically:
   - Parse the JSON file
   - Validate each record
   - Display summary statistics
   - Show the first 100 valid records in a table
4. Use pagination controls to navigate through all valid records

## Sample Data

A sample JSON file (`sample-data.json`) is included in the project root for testing purposes.

## Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **File Processing**: Main thread (no Web Workers as requested)
- **Validation**: Client-side validation with detailed error reporting
- **Pagination**: Custom pagination component with responsive design

## Project Structure

```
src/
├── components/
│   ├── FileUpload.tsx      # File upload component with drag & drop
│   ├── SummaryStats.tsx    # Statistics dashboard
│   └── CustomerTable.tsx   # Paginated customer data table
├── types/
│   └── Customer.ts         # TypeScript interfaces
├── utils/
│   └── validation.ts       # Validation and analysis functions
├── App.tsx                 # Main application component
└── index.css              # Global styles with Tailwind
```

## Validation Rules

The application validates each customer record for:

- **id**: Must be a non-empty string
- **name**: Must be a non-empty string
- **email**: Must be a valid email format
- **country**: Must be a non-empty string

Invalid records are counted but not displayed in the table.
