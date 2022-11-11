#BUILDING THE APP!!

FROM node:19 

# creates a directory and cd into it
WORKDIR /app 

#now i am inside /app

#copying files into /app
#for directories you need to type the full name and not just . because
#if it is . you copy the contents inside but not the directory itself
COPY main.js .
COPY metrics.js .
COPY package.json .
COPY package-lock.json .
COPY views views
COPY public public 

#setup the application - install npm
RUN npm ci

#RUNNING THE APP!!

#running the app on the port
EXPOSE 3000 

ENTRYPOINT node main.js