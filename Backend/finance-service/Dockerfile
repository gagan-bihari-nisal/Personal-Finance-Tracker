# Step 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the shared module first
COPY pft-events ./pft-events
RUN mvn -f pft-events/pom.xml clean install -DskipTests

# Copy finance-service
COPY finance-service ./finance-service
WORKDIR /app/finance-service
RUN mvn clean package -DskipTests

# Step 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/finance-service/target/finance-service-0.0.1-SNAPSHOT.jar app.jar
# Expose the application and debugging port
EXPOSE 8082 5002

# Enable remote debugging by default
ENTRYPOINT ["java", "-Xdebug", "-Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5002", "-jar", "app.jar"]
