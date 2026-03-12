#!/bin/bash

LABEL="platform=microservices-dynamic"

GENERATED_DIR="backend/generated-services"
ARCHIVED_DIR="backend/archived-services"

if [ -z "$1" ]; then
  echo "🧹 Eliminando TODOS los microservicios dinámicos..."

  # Detener contenedores
  docker ps -q --filter "label=$LABEL" | xargs -r docker stop

  # Eliminar contenedores
  docker ps -aq --filter "label=$LABEL" | xargs -r docker rm

  # Eliminar imágenes
  docker images -q --filter "label=$LABEL" | xargs -r docker rmi

  # Eliminar archivos generados
  [ -d "$GENERATED_DIR" ] && rm -rf "${GENERATED_DIR:?}"/*
  [ -d "$ARCHIVED_DIR" ] && rm -rf "${ARCHIVED_DIR:?}"/*

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

  # Eliminar carpetas
  [ -d "$GENERATED_DIR/$ID" ] && rm -rf "${GENERATED_DIR:?}/${ID:?}"
  [ -d "$ARCHIVED_DIR/$ID" ] && rm -rf "${ARCHIVED_DIR:?}/${ID:?}"

  echo "✅ Microservicio $ID eliminado."
fi