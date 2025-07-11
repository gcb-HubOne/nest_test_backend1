# -------- Stage 1: Build --------
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false --legacy-peer-deps
COPY . .
RUN npm run build

# -------- Stage 2: Runtime --------
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# 默认端口，由 Railway 映射
EXPOSE 3000
CMD ["node", "dist/main.js"] 