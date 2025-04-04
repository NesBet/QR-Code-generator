document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const qrForm = document.getElementById("qrForm");
  const urlInput = document.getElementById("urlInput");
  const generateBtn = document.getElementById("generateBtn");
  const qrContainer = document.getElementById("qrContainer");
  const qrCodeOutput = document.getElementById("qrCodeOutput"); // Container for QR code
  const loadingSpinner = document.getElementById("loadingSpinner");
  const downloadBtn = document.getElementById("downloadBtn");
  const urlError = document.getElementById("urlError");
  const qrMessage = document.getElementById("qrMessage");
  const themeToggleButton = document.getElementById("theme-toggle");
  const sunIcon = document.querySelector(".icon-sun");
  const moonIcon = document.querySelector(".icon-moon");

  let currentQRInstance = null; // To hold the QRious instance if needed later
  let qrCodeDataUrl = null; // To store the generated QR code data URL for download

  // --- Utility Functions ---

  /**
   * Validates if a string is a plausible URL.
   * Uses the browser's URL constructor for robust checking.
   * @param {string} string - The string to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  const isValidUrl = (string) => {
    if (!string) return false;
    // Basic check for common schemes and structure
    const pattern =
      /^(?:(?:(?:https?|ftp):)?\/\/|mailto:|tel:|data:)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    if (!pattern.test(string)) {
      return false;
    }

    try {
      new URL(string); // Throws error for invalid URLs
      return true;
    } catch (_) {
      if (/^(?:mailto:|tel:|data:)/i.test(string)) {
        return true; // Allow common non-http protocols if they pass regex
      }
      return false;
    }
  };

  /**
   * Clears the QR code output area and resets related state
   */
  const clearQrOutput = () => {
    qrCodeOutput.innerHTML = "";
    qrMessage.textContent = "";

    // Both hide and disable the download button
    downloadBtn.hidden = true;
    downloadBtn.disabled = true;
    downloadBtn.setAttribute("aria-disabled", "true");

    qrCodeDataUrl = null;
    currentQRInstance = null;

    // If the spinner was visible for some reason, hide it
    if (!loadingSpinner.hidden) {
      hideLoading();
    }
  };

  /**
   * Shows the loading spinner and resets the QR display area.
   */
  const showLoading = () => {
    // First, make sure the output area is cleared
    clearQrOutput();

    // Then show the spinner
    loadingSpinner.hidden = false;
    qrContainer.setAttribute("aria-busy", "true"); // Indicate loading state for accessibility
  };

  /**
   * Hides the loading spinner.
   */
  const hideLoading = () => {
    loadingSpinner.hidden = true;
    qrContainer.setAttribute("aria-busy", "false"); // Indicate loading finished
  };

  /**
   * Generates the QR code using the QRious library.
   * @param {string} url - The URL to encode.
   */
  const generateQrCode = (url) => {
    // --- Step 1: Show Loading State ---
    showLoading();

    // Use setTimeout with increased delay to make the spinner more visible
    setTimeout(() => {
      try {
        // --- Step 2: Generate QR Code ---
        const canvas = document.createElement("canvas");
        currentQRInstance = new QRious({
          element: canvas,
          value: url,
          size: 250,
          padding: 10,
          level: "H",
          background: "#ffffff",
          foreground: "#000000",
        });

        // --- Step 3: Handle Success ---
        qrCodeDataUrl = canvas.toDataURL("image/png"); // Store data URL *before* hiding loading

        hideLoading(); // Hide spinner
        qrCodeOutput.appendChild(canvas); // Display QR code

        // Enable and show the download button
        downloadBtn.hidden = false;
        downloadBtn.disabled = false;
        downloadBtn.setAttribute("aria-disabled", "false");

        qrMessage.textContent = "QR Code generated successfully!";
        qrMessage.style.color = "var(--success-color)";
      } catch (error) {
        // --- Step 4: Handle Error ---
        console.error("QR Code Generation Error:", error);
        hideLoading(); // Hide spinner even on error
        qrMessage.textContent =
          "Error generating QR Code. Please check the URL or try again.";
        qrMessage.style.color = "var(--error-color)";

        // Ensure download button remains hidden and disabled
        downloadBtn.hidden = true;
        downloadBtn.disabled = true;
        downloadBtn.setAttribute("aria-disabled", "true");

        qrCodeOutput.innerHTML = ""; // Clear any potential partial output
        urlInput.setAttribute("aria-invalid", "true"); // Mark input as potentially causing issue
        qrCodeDataUrl = null; // Clear any potentially bad data
      }
    }, 800); // Increased delay for more noticeable loading spinner
  };

  /**
   * Handles the download button click.
   */
  const handleDownload = () => {
    if (!qrCodeDataUrl) {
      console.error("No QR code data URL available for download.");
      qrMessage.textContent =
        "Could not download QR Code. Please generate one first.";
      qrMessage.style.color = "var(--error-color)";

      // Hide and disable button if data is missing
      downloadBtn.hidden = true;
      downloadBtn.disabled = true;
      downloadBtn.setAttribute("aria-disabled", "true");
      return;
    }

    const link = document.createElement("a");
    link.href = qrCodeDataUrl;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * Updates the theme toggle button icon based on the current theme.
   * @param {string} theme - The current theme ('light' or 'dark').
   */
  const updateThemeIcon = (theme) => {
    if (theme === "dark") {
      moonIcon.style.display = "none";
      sunIcon.style.display = "block";
      themeToggleButton.setAttribute("aria-label", "Switch to light mode");
    } else {
      moonIcon.style.display = "block";
      sunIcon.style.display = "none";
      themeToggleButton.setAttribute("aria-label", "Switch to dark mode");
    }
  };

  /**
   * Toggles the color theme between light and dark.
   */
  const toggleTheme = () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Save preference
    updateThemeIcon(newTheme);
  };

  // --- Event Listeners ---

  // Validate URL input on typing/pasting and clear QR output when input changes
  urlInput.addEventListener("input", () => {
    const urlValue = urlInput.value.trim();
    const isValid = isValidUrl(urlValue);

    // Clear previous QR code output whenever input changes
    clearQrOutput();

    if (urlValue === "") {
      urlInput.classList.remove("valid", "invalid");
      urlError.textContent = "";
      urlError.style.display = "none";
      generateBtn.disabled = true;
      urlInput.setAttribute("aria-invalid", "false");
    } else if (isValid) {
      urlInput.classList.add("valid");
      urlInput.classList.remove("invalid");
      urlError.textContent = "";
      urlError.style.display = "none";
      generateBtn.disabled = false;
      urlInput.setAttribute("aria-invalid", "false");
    } else {
      urlInput.classList.add("invalid");
      urlInput.classList.remove("valid");
      urlError.textContent =
        "Please enter a valid URL (e.g., https://example.com)";
      urlError.style.display = "block";
      generateBtn.disabled = true;
      urlInput.setAttribute("aria-invalid", "true");
    }
  });

  // Handle form submission
  qrForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const urlValue = urlInput.value.trim();
    // Re-validate just before generating
    if (isValidUrl(urlValue)) {
      generateQrCode(urlValue);
    } else {
      // Should be prevented by button state, but handle defensively
      urlInput.classList.add("invalid");
      urlError.textContent = "Please enter a valid URL before generating.";
      urlError.style.display = "block";
      generateBtn.disabled = true;
      urlInput.focus();
      urlInput.setAttribute("aria-invalid", "true");
      qrMessage.textContent = "Cannot generate QR Code with invalid URL.";
      qrMessage.style.color = "var(--error-color)";
      clearQrOutput();
    }
  });

  // Handle download button click
  downloadBtn.addEventListener("click", handleDownload);

  // Handle theme toggle button click
  themeToggleButton.addEventListener("click", toggleTheme);

  // --- Initialization ---

  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  generateBtn.disabled = true; // Initially disabled

  // Both hide and disable the download button initially
  downloadBtn.hidden = true;
  downloadBtn.disabled = true;
  downloadBtn.setAttribute("aria-disabled", "true");

  loadingSpinner.hidden = true; // Initially hidden
  urlError.style.display = "none"; // Initially hidden
}); // End DOMContentLoaded
