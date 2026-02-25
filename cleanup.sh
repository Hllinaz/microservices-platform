#!/bin/bash

LABEL="platform=microservices-dynamic"

if [ -z "$1" ]; then
  echo "🧹 Eliminando TODOS los microservicios dinámicos..."

  # Detener contenedores
  docker stop "$(docker ps -q --filter "label=$LABEL")" 2>/dev/null

  # Eliminar contenedores
  docker rm "$(docker ps -aq --filter "label=$LABEL")" 2>/dev/null

  # Eliminar imágenes
  docker rmi "$(docker images -q --filter "label=$LABEL")" 2>/dev/null

	sudo rm -rf backend/generated-services/*

  echo "✅ Limpieza completa."

else
  ID=$1
  NAME="ms-$ID"

  echo "🧹 Eliminando microservicio con ID: $ID"

  # Detener contenedor específico
  docker stop "$NAME" 2>/dev/null

  # Eliminar contenedor específico
  docker rm "$NAME" 2>/dev/null

  # Eliminar imagen específica
  docker rmi "$NAME" 2>/dev/null

  sudo rm -rf backend/generated-services/"$ID"

  echo "✅ Microservicio $ID eliminado."
fi