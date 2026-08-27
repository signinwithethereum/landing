# The contact/newsletter service. Same base and package manager as the site
# build, minus the static-site stages — this one stays a Node process.

FROM node:24-slim AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod


FROM node:24-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json server.js db.js resend.js ./

USER node

EXPOSE 8787

CMD ["node", "server.js"]
