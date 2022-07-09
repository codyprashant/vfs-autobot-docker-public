FROM node:16
ENV NODE_ENV production
ENV DB_URL='XXXXXXXXXXXXXXXXX'
ENV VFS_EMAIL='XXXXXXXXXXXXXXXXXX'
ENV VFS_PASSWORD='XXXXXXXXXXXXXX'
ENV SENDGRID_API_KEY='XXXXXXXXXXXXXXXXXXXXXXXXXX'
ENV SENDER_EMAIL='XXXXXXXXXXXXXXXX'
ENV RECEIVER_EMAIL='XXXXXXXXXXXXXXXXX'
ENV SOURCE_COUNTRY='ind'
ENV DESTINATION_COUNTRY='nld'
ENV PORT=5123
ENV SUB_CATEGORY='BUS'
ENV VISA_CATEGORY='Short-stay Visa'
ENV ALERT_MONTHS='7,8'
RUN  apt-get update \
     && apt-get install -y wget gnupg ca-certificates \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable \
     && apt-get install -y xvfb \
     && rm -rf /var/lib/apt/lists/* \
     && wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh \
     && chmod +x /usr/sbin/wait-for-it.sh
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci --only=production
COPY . .
EXPOSE 5123
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
