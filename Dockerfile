FROM node:8.16.1-stretch-slim

# Dependencies
RUN apt-get update && apt-get install -y unzip libaio1 make g++ python

# Oracle Instant Client
COPY oracle/*.zip /opt/oracle/
RUN unzip "/opt/oracle/*.zip" -d /opt/oracle \
 && rm /opt/oracle/*.zip \
 && mv /opt/oracle/instantclient_12_2 /opt/oracle/instantclient \
 && ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so \
 && ln -s /opt/oracle/instantclient/libocci.so.12.1 /opt/oracle/instantclient/libocci.so

ENV OCI_LIB_DIR /opt/oracle/instantclient
ENV OCI_INC_DIR /opt/oracle/instantclient/sdk/include
ENV LD_LIBRARY_PATH /opt/oracle/instantclient:${LD_LIBRARY_PATH}
ENV PATH /opt/oracle/instantclient:${PATH}

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
