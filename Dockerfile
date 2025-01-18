FROM maven:3.9.9-amazoncorretto-21-alpine AS builder
WORKDIR /app

COPY . .
RUN mvn clean package

FROM amazoncorretto:21-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/target/magazin-bricolaj-0.1.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]