
# Setup Instructions

Follow these steps to set up the project on your local machine.

---

## Prerequisites

Ensure the following are installed on your system:
- [Node.js](https://nodejs.org/) (v14+)
- npm (v6+) or yarn (v1.22+)
- Git

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>

2. **Install Dependencies**:
  npm install

3. **Set Up Environment Variables**:
  Create a .env file in the root directory.
  Add the necessary environment variables as specified in .env.example.

---

## Troubleshooting
If you encounter dependency issues, delete node_modules and reinstall:
```bash
rm -rf node_modules
npm install
