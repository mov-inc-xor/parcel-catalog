FROM node:latest

RUN mkdir -p /usr/src/parcel-catalog/

WORKDIR /usr/src/parcel-catalog

COPY . .

RUN npm i

EXPOSE 3000

CMD npm run dev