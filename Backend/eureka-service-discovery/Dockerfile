# Step 1: Build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Run with lightweight JDK
FROM eclipse-temurin:17-jdk-alpine
# Install curl
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /app/target/eureka-service-discovery-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]