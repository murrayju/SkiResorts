FROM node:12 as builder

ENV buildDir /opt/build
RUN mkdir -p ${buildDir}
WORKDIR ${buildDir}

# Install node dependencies
COPY ["yarn.lock", "package.json", "babel.config.js", "${buildDir}/"]
RUN yarn

# Build the code
ARG BUILD_NUMBER
ENV BUILD_NUMBER ${BUILD_NUMBER:-0}
COPY [".", "${buildDir}/"]
RUN yarn run run publish --publish-node-modules
RUN mkdir /temp && mv "${buildDir}/build/node_modules" "/temp/node_modules_prod"

# Defaults when running this container
EXPOSE 443
ENTRYPOINT ["yarn", "run", "run"]
CMD ["server"]

###
# Production image. Only include what is needed for production
###
FROM node:12 as production

ENV appDir /opt/app
RUN mkdir -p ${appDir}
ENV NODE_ENV production

COPY --from=builder ["/opt/build/build/", "${appDir}/build/"]
COPY --from=builder ["/temp/node_modules_prod", "${appDir}/node_modules"]
RUN  mv ${appDir}/build/package.json ${appDir}/
RUN cp -R ${appDir}/build/config ${appDir}/
RUN mkdir /config

CMD ["node", "./build/src/main.js"]
