#!/bin/bash

# Styling colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;37m' # No Color
BOLD='\033[1m'

echo -e "${CYAN}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}           CAREERHUB PORTAL STARTUP SCRIPT          ${NC}"
echo -e "${CYAN}${BOLD}====================================================${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[Error] Node.js is not installed. Please install Node.js (v18+) to run this project.${NC}"
    exit 1
fi
echo -e "${GREEN}[✔] Node.js detected: $(node --version)${NC}"

# Check for package.json in backend & frontend
if [ ! -f "careerhub-backend/package.json" ] || [ ! -f "careerhub/package.json" ]; then
    echo -e "${RED}[Error] Could not find package.json in careerhub-backend or careerhub folders.${NC}"
    echo -e "${RED}Please ensure you run this script from the project root directory.${NC}"
    exit 1
fi

# Run npm install if node_modules are missing
echo -e "${BLUE}[1/2] Checking and installing dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Root node_modules missing. Installing root packages...${NC}"
    npm install
fi

if [ ! -d "careerhub-backend/node_modules" ]; then
    echo -e "${YELLOW}Backend node_modules missing. Installing backend packages...${NC}"
    npm run install-backend
fi

if [ ! -d "careerhub/node_modules" ]; then
    echo -e "${YELLOW}Frontend node_modules missing. Installing frontend packages...${NC}"
    npm run install-frontend
fi

echo -e "${GREEN}[✔] All dependencies are ready.${NC}"

# Run backend seeds if requested
read -t 5 -p "$(echo -e ${YELLOW}"Do you want to run the database seed script? (y/N) [Auto-skipping in 5s]: "${NC})" run_seed
echo "" # newline

if [[ "$run_seed" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Running Database Seed Script...${NC}"
    npm run seed
fi

# Start the dev servers
echo -e "${BLUE}[2/2] Launching CareerHub Frontend & Backend concurrently...${NC}"
echo -e "${CYAN}Backend: http://localhost:5001${NC}"
echo -e "${CYAN}Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}Press Ctrl+C to terminate both servers.${NC}"
echo -e "${CYAN}${BOLD}----------------------------------------------------${NC}"

npm run dev
