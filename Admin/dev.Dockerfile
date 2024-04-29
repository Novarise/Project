# FROM node:18-alpine

# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* ./
# # Omit --production flag for TypeScript devDependencies
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   # Allow install without lockfile, so example works even without Node.js installed locally
#   else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
#   fi

# COPY . .


# RUN \
#   if [ -f yarn.lock ]; then yarn build; \
#   elif [ -f package-lock.json ]; then npm run build; \
#   else npm run build; \
#   fi

# # Start Next.js based on the preferred package manager
# CMD \
#   if [ -f yarn.lock ]; then yarn start; \
#   elif [ -f package-lock.json ]; then npm run start; \
#   else npm run start; \
#   fi


# FROM node:21-alpine AS build
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile
# COPY . .
# RUN yarn remove bcrypt
# RUN yarn add bcrypt --build-from-source
# RUN yarn build

# FROM node:21-alpine AS run
# WORKDIR /app
# # COPY --from=build /app/.next ./.next
# # COPY --from=build /app/node_modules ./node_modules
# # COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/next.config.js ./
# COPY --from=build /app/public ./public
# COPY --from=build /app/.next ./.next
# # COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/package.json ./package.json

# # EXPOSE 3001
# CMD ["yarn", "start"]

# Use the official Node.js 16 image as the base image
# FROM node:21-alpine


# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   # Allow install without lockfile, so example works even without Node.js installed locally
#   else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
#   fi

# # RUN npm install && \
# #   npm rebuild bcrypt --build-from-source
# RUN npm install

# # RUN yarn build

# COPY . .
# COPY public ./public
# COPY next.config.js .
# COPY tsconfig.json .


# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
# CMD yarn start
# CMD \
#     if [ -f yarn.lock ]; then yarn start; \
#     elif [ -f package-lock.json ]; then npm run dev; \
#     else npm run dev; \
#     fi
FROM node:21-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
