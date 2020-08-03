FROM node:12.16.3-stretch-slim

# Dependencies
RUN apt-get update && apt-get install -y unzip make g++ python libaio1 

# Oracle Instant Client
COPY oracle/*.zip /opt/oracle/
RUN unzip "/opt/oracle/*.zip" -d /opt/oracle \
 && rm /opt/oracle/*.zip \
 && mv /opt/oracle/instantclient_12_2 /opt/oracle/instantclient \
 && ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so \
 && ln -s /opt/oracle/instantclient/libocci.so.12.1 /opt/oracle/instantclient/libocci.so

ENV LD_LIBRARY_PATH /opt/oracle/instantclient:${LD_LIBRARY_PATH}

# Installing project dependencies
COPY package.json /app/package.json
WORKDIR /app
RUN npm install --production

# Copying source code
COPY src /app/src

# Setting environment variables
ENV NODE_ENV "production"
ENV PORT 3000

# Ports for docker run -p
EXPOSE 3000
CMD ["node", "src/server.js"]
