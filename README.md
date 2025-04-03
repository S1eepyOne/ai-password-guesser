# AI Password Guesser

## Overview
The AI Password Guesser is a web-based application that utilizes artificial intelligence techniques to guess a 5-character password using letters, numbers, and symbols. The application features a user-friendly interface that allows users to interact with the password guessing algorithm.

## Project Structure
```
ai-password-guesser
├── public
│   ├── scripts
│   │   ├── main.js
│   │   └── worker.js
│   ├── styles
│   │   └── style.css
│   ├── index.html
│   └── manifest.json
├── src
│   ├── ai
│   │   └── passwordGuesser.js # Contains the PasswordGuesser class
│   ├── utils
│   │   └── helpers.js      # Utility functions
│   └── app.js              # Main application logic
├── server.js                # Server-side logic
├── package.json             # npm configuration file
├── .gitignore               # Files to ignore in version control
├── LICENSE                  # Open Source License
├── README.md                # Project documentation
└── SECURITY.md              # Security Policy
```

## Quick Start (For Beginners)
Don't worry if you're new to this! Follow these simple steps:

### Windows Users
1. Download and install these programs first:
   - [Visual Studio Code](https://code.visualstudio.com/download)
   - [Node.js](https://nodejs.org/) (Download the "LTS" version)

2. Download this project:
   - Click the green "Code" button above
   - Select "Download ZIP"
   - Extract the ZIP file to your Desktop

3. Open the project:
   - Open Visual Studio Code
   - Click "File" → "Open Folder"
   - Find the extracted folder on your Desktop and select it

4. Install and run (copy and paste these commands into the VS Code terminal):
   ```cmd
   npm install
   npm start
   ```

5. Use the app:
   - Open your web browser
   - Go to: http://localhost:3000
   - That's it! You're ready to try guessing passwords
   - To end the server simply kill the terminal by pressing the Trash Can

### Troubleshooting
- If you see "npm not found": Close VS Code and restart your computer
- If you get an error about "port in use": Change the port in server.js to 3001
- Need help? Open an issue on GitHub and we'll assist you!

## Installation (For the Connoisseurs)
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ai-password-guesser
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Open `public/index.html` in a web browser.
2. Follow the on-screen instructions to input your 5-digit password.
3. The AI will attempt to guess the password based on the provided input.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
