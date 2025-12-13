# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["Teddy.sln", "./"]
COPY ["Teddy.Api/Teddy.Api.csproj", "Teddy.Api/"]
COPY ["Teddy.Application/Teddy.Application.csproj", "Teddy.Application/"]
COPY ["Teddy.Domain/Teddy.Domain.csproj", "Teddy.Domain/"]
COPY ["Teddy.Infra/Teddy.Infra.csproj", "Teddy.Infra/"]
COPY ["Teddy.IoC/Teddy.IoC.csproj", "Teddy.IoC/"]

# Restore dependencies
RUN dotnet restore "Teddy.Api/Teddy.Api.csproj"

# Copy all source files
COPY . .

# Build
WORKDIR "/src/Teddy.Api"
RUN dotnet build "Teddy.Api.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Teddy.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 3000

# Copy published files
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Teddy.Api.dll"]
