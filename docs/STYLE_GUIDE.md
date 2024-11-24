# Coding Style Guide

To maintain consistency across the codebase, adhere to these coding standards.

---

## General Guidelines
- Use **camelCase** for variables, functions, and object keys.
- Use **PascalCase** for component and class names.
- Use **kebab-case** for file and folder names.

---

## Spacing and Formatting
- Indentation: Use **2 spaces** per indentation level.
- Line Length: Keep lines under **80 characters** where possible.
- Use single quotes `'` for strings, except when interpolating with template literals.

---

## Commenting
- Use comments to explain **why**, not **what**.
- For functions, use JSDoc format:
  ```javascript
  /**
   * Validates user input.
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {boolean} True if valid, false otherwise.
   */
  function validateInput(email, password) {
    // Validation logic
  }

  
