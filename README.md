# PrimeReact DataTable

This project showcases the use of the **PrimeReact DataTable** component with server-side pagination, row selection overlay, and integration with a mock API.

## Features

- Server-side pagination with total record count
- Row selection with overlay input (select N rows across pages)
- Loading indicator during data fetch
- Responsive UI using TailwindCSS and Lucide icons

## Technologies Used

- **React + Vite** (Fast build tool)
- **PrimeReact** for DataTable components
- **Lucide-react** for icons
- **TailwindCSS** for styling
- **Fetch API** for data requests
- **TypeScript**

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Nidhi-Sharma-1612/prime-react-datatable.git
   cd prime-react-datatable
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open in Browser:**  
   Visit `http://localhost:5173` to see the app in action.

## Project Structure

- `Table.tsx`: Main component rendering the DataTable
- `RowSelectorOverlay.tsx`: Input overlay for selecting rows
- `utils/artworkApi.ts`: API utility for fetching data
- `types.ts`: Shared type definitions
