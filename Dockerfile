# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (with cache optimization)
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Set production env
ENV NODE_ENV=production

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# App port (Nest default)
EXPOSE 3000

# Run the app
CMD ["node", "dist/main.js"]
