# ---- Base runtime image ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# ---- Build image ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore
COPY backend/CalorieCalculator.Api/CalorieCalculator.Api.csproj backend/CalorieCalculator.Api/
RUN dotnet restore "backend/CalorieCalculator.Api/CalorieCalculator.Api.csproj"

# Copy the rest of the backend source and publish
COPY backend/CalorieCalculator.Api/. backend/CalorieCalculator.Api/
RUN dotnet publish "backend/CalorieCalculator.Api/CalorieCalculator.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ---- Final runtime image ----
FROM base AS final
WORKDIR /app
# Create data directory for SQLite
RUN mkdir -p data
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CalorieCalculator.Api.dll"]
