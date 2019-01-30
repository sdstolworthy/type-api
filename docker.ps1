param(
  [string]$env = "development"
)

if ($env -eq "test") {
  docker-compose.exe -f ./docker-compose.test.yml up
} else {
  docker-compose.exe -f ./docker-compose.development.yml up
}
