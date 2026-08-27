# Static build, then nginx. Same shape as the sites this one replaces, so the
# deploy story does not change — only the build command and the output directory.

FROM node:24-slim AS build

WORKDIR /app

RUN apt-get update && apt-get install --yes --no-install-recommends librsvg2-bin \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Copy the manifests first so a dependency install is cached independently of
# the content, which changes far more often.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html

EXPOSE 80
