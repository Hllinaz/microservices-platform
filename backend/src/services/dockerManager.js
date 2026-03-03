// backend/src/services/dockerManager.js

/**
 * Docker Manager
 * Encargado de interactuar con el Docker Engine.
 * 
 * NOTA: Por ahora solo estructura base.
 * La implementación real será desarrollada por el responsable de Docker.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

function generatePythonApp(service) {

  const indentedCode = service.code
    .split("\n")
    .map(line => line.trim() === "" ? line : "    " + line)
    .join("\n");

  return `
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=['GET'])
def execute():
  try:
    # === USER CODE START ===
${indentedCode}
    # === USER CODE END ===

    return jsonify({"result": result})
  except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=${service.port})
  `;
}

function generateNodeApp(service) {
  return `
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  try {
    let result;

    // === USER CODE START ===
    ${service.code}
    // === USER CODE END ===

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(${service.port}, "0.0.0.0");
  `;
}

async function createService(service) {
  console.log(`Creating service ${service.name}`);

  const serviceDir = path.join(
    __dirname,
    '../../generated-services',
    service.id
  );

  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  switch (service.language) {
    case "python":

      fs.writeFileSync(
        path.join(serviceDir, "app.py"),
        generatePythonApp(service)
      );

      fs.writeFileSync(
        path.join(serviceDir, "Dockerfile"),
        `
FROM python:3.11
WORKDIR /app
COPY app.py .
RUN pip install flask
EXPOSE ${service.port}
CMD ["python", "app.py"]
      `
      );

      break;
    case "node":

      fs.writeFileSync(
        path.join(serviceDir, "index.js"),
        generateNodeApp(service)
      );

      fs.writeFileSync(
        path.join(serviceDir, "Dockerfile"),
        `
FROM node:20
WORKDIR /app
COPY index.js .
RUN npm init -y
RUN npm install express
EXPOSE ${service.port}
CMD ["node", "index.js"]
      `
      );

      break;

    default:
      throw new Error("Unsupported language");
  }

  const imageName = `ms-${service.id}`

  await execAsync(
    `docker build -t ${imageName} ${serviceDir}`
  );

  return {
    success: true,
    imageName
  };
}

async function startService(service) {
  console.log(`Starting service ${service.name} on port ${service.port}`);

  const containerName = `ms-${service.id}`;

  if (service.containerId) {
    await execAsync(`docker start ${containerName}`);
  } else {
    const { stdout } = await execAsync(
      `docker run -d \
   --name ms-${service.id} \
   --label platform=microservices-dynamic \
   -p ${service.port}:${service.port} \
   ms-${service.id}`
    );

    service.containerId = stdout.trim();
  }

  return {
    success: true,
    containerId: service.containerId
  };
}

async function stopService(service) {
  console.log(`Stopping service ${service.name}`);

  const containerName = `ms-${service.id}`;

  try {
    await execAsync(`docker stop ${containerName}`);
  } catch (err) {
    // Ignore
  }

  return {
    success: true
  };
}

async function removeService(service) {
  console.log(`Removing service ${service.name}`);

  const serviceDir = path.join(
    __dirname,
    "../../generated-services",
    service.id
  );

  const containerName = `ms-${service.id}`;
  const imageName = `ms-${service.id}`;

  try {
    await execAsync(`docker rm -f ${containerName}`);
  } catch (err) {}

  try {
    await execAsync(`docker rmi ${imageName}`);
  } catch (err) {}

  if (fs.existsSync(serviceDir)) {
    fs.rmSync(serviceDir, { recursive: true, force: true });
  }

  return { success: true };
}

module.exports = {
  createService,
  startService,
  stopService,
  removeService
};