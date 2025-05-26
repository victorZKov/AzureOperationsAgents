# Etapa 1: Build con Node
FROM node:20-alpine AS builder

WORKDIR /app

# Recibe variables desde el docker-compose
ARG VITE_MSAL_CLIENT_ID
ARG VITE_MSAL_AUTHORITY
ARG VITE_MSAL_REDIRECT_URI
ARG VITE_MSAL_SCOPES
ARG VITE_HOST_API

ENV VITE_MSAL_CLIENT_ID=$VITE_MSAL_CLIENT_ID
ENV VITE_MSAL_AUTHORITY=$VITE_MSAL_AUTHORITY
ENV VITE_MSAL_REDIRECT_URI=$VITE_MSAL_REDIRECT_URI
ENV VITE_MSAL_SCOPES=$VITE_MSAL_SCOPES
ENV VITE_HOST_API=$VITE_HOST_API

COPY . .

RUN yarn install --frozen-lockfile && yarn build

# Etapa 2: Contenedor final con NGINX
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
