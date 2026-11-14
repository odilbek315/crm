# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install essential dependencies for native compilations
RUN apk add --no-cache python3 make g++

# Copy package configurations
COPY package*.json ./

# Clean installation of dependencies
RUN npm ci

# Copy application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Vite static bundle & compile server.ts via esbuild to dist/server.cjs
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production package requirements
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma clients from builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy build artifacts and Database files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Configure production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose internal port
EXPOSE 3000

# Push migrations & start the production bundle
CMD ["sh", "-c", "npx prisma db push && npm run start"]
