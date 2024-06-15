import subprocess

def main():
    # Crear un entorno de Node.js dentro del entorno de Poetry
    subprocess.run(['poetry', 'run', 'nodeenv', '-p'], check=True)

    # Instalar Create React App
    subprocess.run(['poetry', 'run', 'npx', 'create-react-app', 'frontend-assignment-service'], check=True)

    # Navegar al directorio del proyecto de React
    project_path = 'frontend-assignment-service'

    # Instalar Material-UI en el proyecto de React
    subprocess.run(['poetry', 'run', 'npm', 'install', '@mui/material', '@emotion/react', '@emotion/styled'], cwd=project_path, check=True)
    subprocess.run(['poetry', 'run', 'npm', 'install', '@mui/icons-material'], cwd=project_path, check=True)

if __name__ == "__main__":
    main()