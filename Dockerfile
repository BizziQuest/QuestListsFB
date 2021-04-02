
# use the node image as the base image
FROM node:15.2.1

# copy contents of 
COPY ./ /app/

# make the root the active directory
WORKDIR /app

# install all packages globally
RUN yarn install

# when the image is run, run the server
CMD ['yarn', 'container']