FROM liquibase/liquibase:latest

WORKDIR /liquibase

COPY ./db/changelog /liquibase/changelog

# Set the entrypoint for Liquibase
ENTRYPOINT ["liquibase"]
