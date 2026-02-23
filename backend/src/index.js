/**
 * Microservice Model:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   language: "python" | "node",
 *   port: number,
 *   status: "created",
 *   containerId: null,
 *   createdAt: Date
 * }
 */

const PORT = 5000;

const express = require('express');
const cors = require('cors');

const { randomUUID } = require('crypto')

const app = express();
const services = new Map();

let nextPort = 6000;

const ServiceStatus = Object.freeze({
  CREATED: "created",
  RUNNING: "running",
  STOPPED: "stopped"
});
const allowedStatuses = Object.values(ServiceStatus);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Backend Manager",
    timestamp: new Date()
  });
});

app.get('/services', (req, res) => {
  const allServices = Array.from(services.values());

  res.status(200).json({
    success: true,
    count: allServices.length,
    services: allServices
  });
});

app.post('/services', (req, res) => {
  const { name, description, language, code } = req.body;

  // Validación básica
  if (!name || !language || !code) {
    return res.status(400).json({
      success: false,
      message: "name, language and code are required"
    });
  }

  if (!["python", "node"].includes(language)) {
    return res.status(400).json({
      success: false,
      message: "language must be 'python' or 'node'"
    })
  }

  const id = randomUUID();
  const port = nextPort++;

  const newService = {
    id,
    name,
    description: description || "",
    language,
    port,
    status: ServiceStatus.CREATED,
    containerId: null,
    createdAt: new Date()
  };

  services.set(id, newService);

  res.status(201).json({
    success: true,
    service: newService
  });
})

app.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  if (!services.has(id)) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  services.delete(id);

  res.status(200).json({
    success: true,
    message: "Service removed"
  });
});

app.patch('/services/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!services.has(id)) {
    return res.status(404).json({
      success: false,
      message: "Service not found"
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
    });
  }

  const service = services.get(id);

  if (status === ServiceStatus.RUNNING) {
    console.log("Debería iniciar contenedor");
  }

  if (status === ServiceStatus.STOPPED) {
    console.log("Debería detener contenedor");
  }

  service.status = status;

  res.status(200).json({
    sucess: true,
    service
  });
});

app.listen(PORT, () => {
  console.log(`Backend Manager running on port ${PORT}`);
});