# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["CalorieCalculator.Api.csproj", "./"]
RUN dotnet restore "CalorieCalculator.Api.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "CalorieCalculator.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Expose port 8080 (Render uses this by default)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy published output from build stage
COPY --from=build /app/publish .

# Set the entrypoint
ENTRYPOINT ["dotnet", "CalorieCalculator.Api.dll"]
