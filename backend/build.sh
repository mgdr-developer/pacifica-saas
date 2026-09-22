#!/bin/bash
set -e

# Cambiar al directorio donde está ubicado este script
cd "$(dirname "$0")"

# Asegurar permisos de ejecución al Maven Wrapper
chmod +x ./mvnw

echo "=========================================="
echo " 🔨 Compilando y empaquetando Backend (JAR)..."
echo "=========================================="

./mvnw clean package -DskipTests "$@"

echo ""
echo "✅ Empaquetado exitoso. Archivo .jar generado en target/"
