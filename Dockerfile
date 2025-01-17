FROM maven:3.9.9-amazoncorretto-21-alpine AS builder
WORKDIR /app

COPY . .
RUN mvn clean package

COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]