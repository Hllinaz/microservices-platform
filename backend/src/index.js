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

const dockerManager = require('./services/dockerManager.js');
const { validateTransition } = require('./services/serviceManager.js')

const app = express();
const services = new Map();

let nextPort = 10000;

const ServiceStatus = Object.freeze({
  CREATED: "created",
  RUNNING: "running",
  STOPPED: "stopped",
  REMOVED: "removed"
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
    code,
    port,
    status: ServiceStatus.CREATED,
    containerId: null,
    imageBuilt: false,
    createdAt: new Date()
  };

  services.set(id, newService);

  res.status(201).json({
    success: true,
    service: newService
  });
})

app.patch('/services/:id/status', async (req, res) => {
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

  try {

    validateTransition(service.status, status);

    switch (status) {
      case ServiceStatus.RUNNING:
        if (!service.imageBuilt) {
          await dockerManager.createService(service);
          service.imageBuilt = true;
        }
        await dockerManager.startService(service);
        break;
      case ServiceStatus.STOPPED:
        await dockerManager.stopService(service);
        break;
      case ServiceStatus.REMOVED:
        await dockerManager.removeService(service);
        break;
    }

    service.status = status;

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    console.error(error);

    const isBusinessError =
      error.message.includes("Invalid transition");

    return res.status(isBusinessError ? 400 : 500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Manager running on port ${PORT}`);
});