# Step 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build aplikasi NestJS (compile TypeScript -> JavaScript)
RUN npm run build


# Step 2: Run stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy hanya file hasil build + dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy build result dari stage builder
COPY --from=builder /app/dist ./dist

# Expose port NestJS (default: 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "dist/main"]
