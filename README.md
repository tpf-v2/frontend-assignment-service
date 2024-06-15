# Assignment Service

This project uses React and Material-UI (MUI) for the frontend, and Poetry to manage the virtual environment for Python.

## Requirements

- Python 3.x
- Poetry

## Installation

1. **Install Python dependencies using Poetry:**
    ```bash
    poetry install
    ```

2. **Initialize the React project using the setup script:**
    ```bash
    poetry run python setup_react.py
    ```

## Running the Project

To start the React development server:

1. **Navigate to the React project directory:**
    ```bash
    cd frontend-assignment-service
    ```

2. **Start the development server:**
    ```bash
    poetry run npm start
    ```

The application will open at `http://localhost:3000`.

## Building for Production

To create an optimized production build:

1. **Navigate to the React project directory:**
    ```bash
    cd frontend-assignment-service
    ```

2. **Run the build command:**
    ```bash
    poetry run npm run build
    ```

## Project Structure

- `frontend-assignment-service/`: Contains the React project.
- `setup_react.py`: Script to initialize the Node.js environment and the React project.