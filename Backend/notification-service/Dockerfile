# notification-service/Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# copy shared module and install it
COPY pft-events ./pft-events
RUN mvn -f pft-events/pom.xml clean install -DskipTests

# copy notification-service and build
COPY notification-service ./notification-service
WORKDIR /app/notification-service
RUN mvn clean package -DskipTests

# runtime image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/notification-service/target/notification-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083 5003
# Enable remote debugging by default
ENTRYPOINT ["java", "-Xdebug", "-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5003", "-jar", "app.jar"]

