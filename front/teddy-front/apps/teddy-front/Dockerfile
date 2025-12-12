FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx nx build teddy-front --prod

FROM nginx:alpine

COPY --from=builder /app/dist/apps/teddy-front /usr/share/nginx/html

COPY apps/teddy-front/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
