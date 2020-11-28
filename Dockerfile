FROM node:12.18-alpine
WORKDIR /sorter-generator
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --silent
COPY . .
EXPOSE 3000
RUN mv .env.example .env
RUN npm run build:prod