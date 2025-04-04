# QR Code Generator Web App

![QR Code Generator Banner](https://example.com/qr-banner.png)

A lightweight, fast, and responsive web application for generating QR codes from URLs. This tool allows users to create custom QR codes that can be easily downloaded and used in digital or print materials.

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
  - [Basic Setup](#basic-setup)
  - [Development Environment](#development-environment)
- [Usage](#usage)
- [Technical Details](#technical-details)
- [Browser Compatibility](#browser-compatibility)
- [Customization](#customization)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## ✨ Features

- **Instant QR Generation**: Create QR codes in real-time as you type a valid URL
- **Download Functionality**: Save generated QR codes as high-quality PNG images
- **Responsive Design**: Works flawlessly on mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing in any environment
- **Accessibility Focused**: Built with ARIA attributes and keyboard navigation support
- **Offline Capable**: Can function without an internet connection once loaded
- **No Registration Required**: Free to use with no sign-up process
- **No Server Dependencies**: Runs entirely in the browser using client-side JavaScript

## 🌐 Demo

Try out the QR Code Generator: [https://yourdomain.com/qr-generator](https://yourdomain.com/qr-generator)

![QR Code Generator Screenshot](https://example.com/screenshot.png)

## 💻 Installation

### Basic Setup

The QR Code Generator is a static web application that doesn't require a backend server. To install:

1. Clone the repository or download the source code:
   ```bash
   git clone https://github.com/yourusername/qr-code-generator.git
   cd qr-code-generator
   ```

2. Open the project in your preferred web server or file server. You can use any of these methods:

   **Option 1**: Using Python's built-in HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   Then open `http://localhost:8000` in your browser.

   **Option 2**: Using Node.js and http-server:
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```
   Then open `http://localhost:8000` in your browser.

   **Option 3**: Simply open the `index.html` file directly in your web browser.

### Development Environment

For those who want to modify or enhance the application:

1. Make sure you have Node.js and npm installed

2. Install development dependencies (if you plan to use build tools):
   ```bash
   npm install
   ```

3. Start a development server with live reload (if available in your workflow):
   ```bash
   npm start
   ```

## 🚀 Usage

1. Open the application in your web browser
2. Enter a valid URL in the input field (e.g., https://example.com)
3. The application will validate your input in real-time
4. Once a valid URL is entered, click the "Generate QR Code" button
5. After the QR code appears, click "Download PNG" to save the image
6. Scan the QR code with any mobile device camera or QR code scanner app to verify it works

## 🔧 Technical Details

### Core Technologies

- **HTML5**: Semantic markup for structure
- **CSS3**: Custom properties for theming, flexbox for layout
- **JavaScript**: ES6+ for interactive functionality
- **QRious Library**: For QR code generation ([GitHub](https://github.com/neocotic/qrious))

### Architecture

The application follows a simple modular architecture:

- `index.html`: Core HTML structure and elements
- `style.css`: All styling and theme definitions
- `script.js`: Application logic and user interaction handling

### Code Organization

The JavaScript code is organized into several functional areas:

- URL validation and input handling
- QR code generation process
- Theme management
- Download functionality
- Accessibility enhancements

## 🌍 Browser Compatibility

The QR Code Generator works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

Mobile browsers:
- iOS Safari
- Android Chrome
- Samsung Internet

Internet Explorer is not supported.

## 🎨 Customization

### Changing Colors and Themes

To customize the application's appearance, modify the CSS variables in the `:root` section of `style.css`:

```css
:root {
    /* Light Theme (Default) */
    --bg-color: #f4f7f9;
    --text-color: #222;
    --primary-color: #007bff;
    /* Add or modify other variables as needed */
}

[data-theme="dark"] {
    --bg-color: #1a1a2e;
    --text-color: #e0e0e0;
    --primary-color: #00a8cc;
    /* Add or modify other variables as needed */
}
```

### Modifying QR Code Options

To change the default QR code settings, update the QRious initialization options in the `generateQrCode` function in `script.js`.

## ❓ FAQ

### Can I generate QR codes for content other than URLs?

The current version is optimized for URLs, but it can technically generate QR codes for any text content. Future updates may include dedicated options for other content types.

### Are the generated QR codes permanent?

Yes. The QR codes are generated in your browser and don't rely on any external service. Once downloaded, they will continue to work indefinitely.

### Is there a limit to how many QR codes I can generate?

No, you can generate as many QR codes as you need. There are no usage limits.

### Do you store my data?

No. All processing happens in your browser. We don't collect, store, or transmit any of the URLs or data you enter.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style guidelines.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- QR code generation powered by [QRious](https://github.com/neocotic/qrious)
- Icons provided by [Heroicons](https://heroicons.com/)
- Color scheme inspired by [Tailwind CSS](https://tailwindcss.com/)

---

## Contact

If you have any questions or suggestions, please open an issue on GitHub or contact [nehemiah.kibet77@gmail.com](mailto:nehemiah.kibet77@gmail.com).
You can also reach out to me by visiting my [portfolio](https://neshkibet.vercel.app).

Built with ❤️ by [Neshacks]

---

*Last updated: [04-04-2025]*
