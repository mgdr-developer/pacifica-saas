#!/bin/bash
set -e

# Cambiar al directorio donde está ubicado este script
cd "$(dirname "$0")"

# Asegurar permisos de ejecución al Maven Wrapper
chmod +x ./mvnw

echo "=========================================="
echo " 🚀 Levantando Backend con Spring Boot..."
echo "=========================================="

./mvnw spring-boot:run "$@"
