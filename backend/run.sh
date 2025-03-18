#!/bin/bash

# Clean and build the project
echo "Running clean install..."
./mvnw clean install
if [ $? -ne 0 ]; then
  echo "Maven build failed"
  exit 1
fi

# Run the Spring Boot application
echo "Running Spring Boot application..."
./mvnw spring-boot:run
if [ $? -ne 0 ]; then
  echo "Spring Boot application failed to start"
  exit 1
fi
