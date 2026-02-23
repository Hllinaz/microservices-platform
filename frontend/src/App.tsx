import { useEffect, useState } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>("Loading...")

  useEffect(() => {
    fetch("http://localhost:5000/health")
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data.status)
      })
      .catch(() => {
        setBackendStatus("Backend not reachable")
      })
  }, [])

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Microservices Platform</h1>
      <h2>Backend Status: {backendStatus}</h2>
    </div>
  )
}

export default App
