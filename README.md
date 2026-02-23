## Arquitectura del Sistema

La plataforma está diseñada bajo un enfoque de **arquitectura basada en microservicios con orquestación centralizada**, donde un componente gestor administra dinámicamente la creación y el ciclo de vida de los servicios.

### Diagrama General de Arquitectura

```mermaid
graph TD

    A[Usuario]-->|HTTP| B[Frontend - React Dashboard]
    B -->|REST API| C[Backend Manager - Node/Express]
    C -->|Docker CLI / Docker SDK| D[Docker Engine]
    D --> E[Microservicio 1 - Contenedor]
    D --> F[Microservicio 2 - Contenedor]
    D --> G[Microservicio N - Contenedor]
```

#### Descripción

La arquitectura se compone de tres capas principales:

* **Capa de presentación**: Interfaz web desarrollada en React.
* **Capa de Gestión**: Backend encargado de la orquestación de microservicios.
* **Capa de Ejecucición**: Conjunto de contenedores Docker que ejecutan microservicios independientes.

Cada microservicio se ejecuta en un contenedor aislado, garantizando desacoplamiento y escalabilidad.

### Diagrama de Secuencia - Creación Dinámica de Microservicio

```mermaid
sequenceDiagram

    participant U as Usuario
    participant F as Frontend
    participant B as Backend Manager
    participant D as Docker Engine
    participant M as Nuevo Microservicio

    U->>F: Ingresa código + lenguaje
    F->>B: POST /services
    B->>B: Genera carpeta y Dockerfile
    B->>D: docker build
    B->>D: docker run
    D->>M: Contenedor iniciado
    B->>F: Retorna URL del servicio
```

#### Descripción

El proceso de creación es completamente automatizado:

1. El usuario envía el código fuente.
2. El backend genera la estructura del servicio.
3. Se construye la imagen Docker.
4. Se despliega el contenedor.
5. El sistema retorna el endpoint expuesto.

### Diagrama de Red y Aislamiento

```mermaid
graph LR

    subgraph Docker Network
        A[Frontend Container]
        B[Backend Manager Container]
        C[Microservicio 1]
        D[Microservicio 2]
    end

    A --> B
    B --> C
    B --> D
```

#### Descripción

Todos los contenedores se encuentran dentro de una red virtual Docker que permite:

* Comunicación interna segura
* Aislamiento entre servicios
* Escalabilidad dinámica
* Independencia de despliegue