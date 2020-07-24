FROM php:7.1-apache


RUN set -ex apk --no-cache add libpq-dev && \
    apt-get update && apt-get install -y libpq-dev \
    vim