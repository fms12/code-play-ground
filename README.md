# CodePlayGround

A high-performance development sandbox for exploring AI projects, utility libraries, and advanced pattern-matching logic. This project leverages modern tooling to ensure fast iteration cycles and robust CLI capabilities.

## 🚀 Tech Stack

This project utilizes a curated selection of world-class libraries:

- **[Sucrase](https://sucrase.io/)**: Used for ultra-fast transpilation of TypeScript/JSX, providing a significantly faster development experience than Babel.
- **[Commander.js](https://github.com/tj/commander.js)**: Powers the command-line interface, allowing for complex argument parsing and sub-command structures.
- **[Dotenv](https://github.com/motdotla/dotenv)**: Manages environment variables securely using `.env` files.
- **Pattern Matching Ecosystem**: 
    - `is-glob`: To detect glob patterns.
    - `to-regex-range`: For generating optimized regex-compatible strings for numeric ranges.
    - `is-number`: Reliable finite number validation.

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 12 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory to manage your environment variables:

```env
PORT=3000
DEBUG=true
```

## 💻 Usage

Since this project uses **Sucrase**, you can run TypeScript files directly without a slow compilation step:

```bash
node -r sucrase/register your-script.ts
```

If you are using the CLI features built with **Commander**:

```bash
node -r sucrase/register src/cli.ts --help
```

## 📜 License

MIT
