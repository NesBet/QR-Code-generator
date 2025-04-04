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
      // Allow common non-http protocols if they pass regex and URL constructor fails
      // (e.g., mailto:, tel: might fail in some stricter environments but are valid uses)
      if (/^(?:mailto:|tel:|data:)/i.test(string)) {
        return true;
      }
      // Allow simple strings without protocol if they look like domain names
      // (common user input pattern, assume https)
      if (
        !/^(?:(?:https?|ftp):)?\/\//i.test(string) &&
        /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?(\/.*)?$/i.test(
          string,
        )
      ) {
        // You might want to prepend 'https://' later if using this lax check
        return true;
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
    downloadBtn.hidden = true;
    downloadBtn.disabled = true;
    downloadBtn.setAttribute("aria-disabled", "true");
    qrCodeDataUrl = null;
    currentQRInstance = null;
    if (!loadingSpinner.hidden) {
      hideLoading();
    }
  };

  /**
   * Shows the loading spinner and resets the QR display area.
   */
  const showLoading = () => {
    clearQrOutput();
    loadingSpinner.hidden = false;
    qrContainer.setAttribute("aria-busy", "true");
  };

  /**
   * Hides the loading spinner.
   */
  const hideLoading = () => {
    loadingSpinner.hidden = true;
    qrContainer.setAttribute("aria-busy", "false");
  };

  /**
   * Generates the QR code using the QRious library.
   * @param {string} url - The URL to encode.
   */
  const generateQrCode = (url) => {
    showLoading();

    // Use setTimeout with delay
    setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        // --- QRious Configuration Change ---
        // Removed the 'padding' option. The QR pattern will now use more of the canvas space.
        // The visual white margin is handled by CSS padding on the canvas element itself.
        currentQRInstance = new QRious({
          element: canvas,
          value: url,
          size: 250, // Size of the canvas element itself
          // padding: 10, // REMOVED - Internal quiet zone padding from QRious
          level: "H", // Error correction level (High)
          background: "#ffffff", // Background of the entire canvas
          foreground: "#000000", // Color of the QR code modules
        });
        // --- End of QRious Configuration Change ---

        qrCodeDataUrl = canvas.toDataURL("image/png");

        hideLoading();
        qrCodeOutput.appendChild(canvas);

        downloadBtn.hidden = false;
        downloadBtn.disabled = false;
        downloadBtn.setAttribute("aria-disabled", "false");

        qrMessage.textContent = "QR Code generated successfully!";
        qrMessage.style.color = "var(--success-color)";
        urlInput.removeAttribute("aria-invalid"); // Clear potential previous error state
      } catch (error) {
        console.error("QR Code Generation Error:", error);
        hideLoading();
        qrMessage.textContent =
          "Error generating QR Code. Please check the URL or try again.";
        qrMessage.style.color = "var(--error-color)";
        downloadBtn.hidden = true;
        downloadBtn.disabled = true;
        downloadBtn.setAttribute("aria-disabled", "true");
        qrCodeOutput.innerHTML = "";
        urlInput.setAttribute("aria-invalid", "true");
        qrCodeDataUrl = null;
      }
    }, 500); // Adjusted delay slightly
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
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  };

  // --- Event Listeners ---

  urlInput.addEventListener("input", () => {
    const urlValue = urlInput.value.trim();

    // Clear previous QR code output when input changes significantly
    if (qrCodeOutput.innerHTML || qrMessage.textContent) {
      clearQrOutput();
    }

    if (urlValue === "") {
      urlInput.classList.remove("valid", "invalid");
      urlError.textContent = "";
      urlError.style.display = "none";
      generateBtn.disabled = true;
      urlInput.setAttribute("aria-invalid", "false");
    } else {
      // Basic validation feedback while typing
      const isValid = isValidUrl(urlValue); // Use the validation function
      if (isValid) {
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
          "Please enter a valid URL (e.g., https://example.com, mailto:a@b.com)";
        urlError.style.display = "block";
        generateBtn.disabled = true;
        urlInput.setAttribute("aria-invalid", "true");
      }
    }
  });

  qrForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const urlValue = urlInput.value.trim();
    // Final validation check on submit
    if (isValidUrl(urlValue)) {
      generateQrCode(urlValue);
    } else {
      urlInput.classList.add("invalid");
      urlError.textContent = "Please enter a valid URL before generating.";
      urlError.style.display = "block";
      generateBtn.disabled = true;
      urlInput.focus();
      urlInput.setAttribute("aria-invalid", "true");
      qrMessage.textContent = "Cannot generate QR Code with invalid URL.";
      qrMessage.style.color = "var(--error-color)";
      clearQrOutput(); // Ensure output is clear if submit fails validation
    }
  });

  downloadBtn.addEventListener("click", handleDownload);
  themeToggleButton.addEventListener("click", toggleTheme);

  // --- Initialization ---
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  generateBtn.disabled = true;
  downloadBtn.hidden = true;
  downloadBtn.disabled = true;
  downloadBtn.setAttribute("aria-disabled", "true");
  loadingSpinner.hidden = true;
  urlError.style.display = "none";
});
