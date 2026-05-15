# CodePlayGround

<div align="center">
  <!-- REPLACE THE URL BELOW WITH YOUR ACTUAL PROJECT IMAGE -->
  <img src="https://via.placeholder.com/1000x400?text=CodePlayGround+Main+Banner" alt="CodePlayGround Banner" width="100%">
  
  <p>A modern full-stack application leveraging <b>FastAPI</b> for a high-performance backend and <b>React</b> for a dynamic user interface.</p>
</div>

---

## 🚀 Tech Stack

### Backend

- **FastAPI**: High-performance Python web framework for building APIs.
- **Pydantic**: Data validation and settings management using Python type annotations.
- **Uvicorn**: A lightning-fast ASGI server implementation.

### Frontend

- **React**: Declarative, efficient, and flexible JavaScript library for building UIs.
- **Vite**: Next-generation frontend tooling for a fast development experience.

## 🛠️ Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js (v16+)** & npm/yarn

### Installation

#### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

#### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## ⚙️ Configuration

Ensure you create a `.env` file in the backend root for sensitive credentials:

```env
DATABASE_URL=sqlite:///./test.db
API_SECRET_KEY=your_secret_here
```

## 📜 License

MIT
