import subprocess
import os
import platform

# Step 1: Start FastAPI backend
print("Starting FastAPI backend at http://localhost:8000...")
backend = subprocess.Popen(["uvicorn", "get_cost_api:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])

# Step 2: Install frontend dependencies
frontend_path = os.path.join(os.getcwd(), "get-cost-frontend")
print(f"Installing frontend dependencies in: {frontend_path}")
subprocess.run(["npm", "install", "--legacy-peer-deps"], cwd=frontend_path)

# Step 3: Start React frontend
print("Starting React frontend at http://localhost:3000...")
frontend_command = ["npm", "start"]
if platform.system() == "Windows":
    frontend = subprocess.Popen(frontend_command, cwd=frontend_path, shell=True)
else:
    frontend = subprocess.Popen(frontend_command, cwd=frontend_path)

# Step 4: Wait and handle exits
try:
    backend.wait()
    frontend.wait()
except KeyboardInterrupt:
    print("\nShutting down both frontend and backend...")
    backend.terminate()
    frontend.terminate()