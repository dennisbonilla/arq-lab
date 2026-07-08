# Debian slim base (glibc), not Alpine: avoids musl's DNS problems
# with many concurrent lookups on the Docker network.
FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public

EXPOSE 9002

CMD ["node", "server.js"]
