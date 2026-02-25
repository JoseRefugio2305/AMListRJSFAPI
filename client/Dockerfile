FROM node:24.14.0-slim AS builder

WORKDIR /client

RUN corepack enable

COPY package.json ./
COPY pnpm-*.yaml ./

RUN pnpm install --frozen-lockfile

COPY . . 

RUN pnpm build

FROM nginx:trixie-perl

COPY --from=builder /client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]