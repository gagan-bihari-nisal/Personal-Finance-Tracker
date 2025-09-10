# Step 1: Use official JDK for building
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Use lightweight JDK for running
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/auth-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081 5001

# Enable remote debugging by default
ENTRYPOINT ["java", "-Xdebug", "-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5001", "-jar", "app.jar"]