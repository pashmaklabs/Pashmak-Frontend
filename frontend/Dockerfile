# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy all source files
COPY . .

# Build the application (if needed)
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app ./

EXPOSE 5173

# Run the application
CMD [ "npm", "run", "dev" , "--", "--host"]