FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY Relevantz.PhotoValidator.Api/Relevantz.PhotoValidator.Api.csproj Relevantz.PhotoValidator.Api/
RUN dotnet restore Relevantz.PhotoValidator.Api/Relevantz.PhotoValidator.Api.csproj
COPY . ./
WORKDIR /src/Relevantz.PhotoValidator.Api
RUN dotnet publish -c Release -o /app/publish
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5101
ENTRYPOINT ["dotnet", "Relevantz.PhotoValidator.Api.dll"]




