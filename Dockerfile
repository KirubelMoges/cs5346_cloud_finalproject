FROM node:17 AS ui-build
WORKDIR /usr/src/app
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

FROM node:17 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/build ./frontend/build
COPY backend/package*.json ./backend/
COPY backend/routes.js ./backend/
COPY backend/index.js ./backend/

EXPOSE 80

RUN cd backend && npm install 
CMD ["node", "./backend/index.js"]
