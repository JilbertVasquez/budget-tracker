FROM mcr.microsoft.com/dotnet/aspnet:9.0-nanoserver-1809 AS base
WORKDIR /app
EXPOSE 5004

ENV ASPNETCORE_URLS=http://+:5004

FROM mcr.microsoft.com/dotnet/sdk:9.0-nanoserver-1809 AS build
ARG configuration=Release
WORKDIR /src
COPY ["budget-tracker-client/budget-tracker-client.csproj", "budget-tracker-client/"]
RUN dotnet restore "budget-tracker-client\budget-tracker-client.csproj"
COPY . .
WORKDIR "/src/budget-tracker-client"
RUN dotnet build "budget-tracker-client.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "budget-tracker-client.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "budget-tracker-client.dll"]
