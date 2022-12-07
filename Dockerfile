
# use the node image as the base image
FROM node:18

# copy contents of 
COPY ./ /app/

# make the root the active directory
WORKDIR /app

# install all packages globally
RUN npm install -g pnpm
RUN pnpm install

# when the image is run, run the server
CMD ['pnpm', 'container']