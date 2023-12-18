# Use the desired base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /nextjs_travel_ai_ui

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and optionally other configuration files (like pnpm-lock.yaml)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of your application's source code
COPY . .

# Build the Next.js application using the locally installed next
RUN pnpm build

# Your application's start command
CMD ["pnpm", "start"]
