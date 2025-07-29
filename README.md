
# FileLu API Cleint

  

This React app is a demo client for the FileLu API, featuring file upload, file management, folder management, file restore, and remote upload functionalities. It uses Material UI (MUI) for UI components and theming, Framer Motion for smooth animations, and supports light/dark theme toggling.

  

---

  

## Features

  

- Upload files with folder assignment

- View and manage files: rename, clone, delete (with confirmation)

- Manage folders: create, rename (via dialog), delete (with confirmation)

- Restore deleted files

- Remote file upload via URL

- Light/dark theme toggle with icon in the top bar

- Responsive, animated UI with polished Material Design styling

- Custom fonts using Lexend font family

  

---

  

## Setup Instructions

  

1.  **Clone the repository**

  

2. Install dependencies

  

npm install

  
  

3. Set up environment variables

  

The app requires your FileLu API key to authenticate requests. Create a .env file in the project root with the following content:

  

REACT_APP_FILELU_API_KEY=your_api_key_here

  

Replace your_api_key_here with your actual FileLu API key.

  
  

4. Configure API

  

Ensure your API functions in src/api/fileluApi.ts use this environment variable (e.g., process.env.REACT_APP_FILELU_API_KEY) when making requests.

  
  

5. Run the development server

  

npm start

  

This starts the app locally at http://localhost:3000.

  
  

## Key Technologies Used

- React with functional components and hooks

- Material UI (MUI v5) for UI components, theming, and responsiveness

- Framer Motion for smooth animations on list items and dialogs

- @fontsource/lexend to load Lexend font family

- Snackbar notifications for consistent user feedback messages

- Dark/Light mode toggle persisted in localStorage (optional)


## How to Use

- Use the top bar toggle button (sun/moon icon) to switch between light and dark themes.

- Upload files via “Upload File” tab; choose folder if needed.

- Manage files in “Files List” tab: rename, clone, or delete files with confirmation.

- Manage folders in “Folder Management” tab with full CRUD operations and dialogs.

- Restore deleted files from “Restore” tab.

- Upload remote files by entering URLs in “Remote Upload” tab.

  
## Troubleshooting

- API errors or no data?

Verify backend API URL configurations and that backend is running. Also check you have set REACT_APP_FILELU_API_KEY correctly.

  
## License
MIT License

### Enjoy managing your files effortlessly with FileLu API Client App!