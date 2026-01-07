# HA Kubernetes Platform with PostgreSQL and Auto-Scaling Web Application

## 📌 Project Overview

This project demonstrates a **High Availability (HA) Kubernetes platform** running a **Node.js web application** backed by **PostgreSQL**, deployed using **Kubernetes best practices**.  
It includes **stateful workloads, rolling deployments, health checks, service discovery, and horizontal auto-scaling (HPA)**.

The goal of this task is to design, deploy, and validate a **production-ready Kubernetes architecture** that can:
- Recover from pod failures
- Scale automatically based on load
- Maintain database connectivity
- Follow cloud-native design principles

---

## 🧱 Architecture Overview
```
| Kubernetes |
| |
| +----------------------+ |
| | Web App Deployment | |
| | (3+ replicas, HPA) | |
| +----------+-----------+ |
| | |
| ClusterIP Service |
| | |
| +----------v-----------+ |
| | PostgreSQL StatefulSet | |
| | Persistent Volume | |
| +----------------------+ |
| |

```
## Features Implemented

### Kubernetes Core Concepts
- Namespace isolation (`ha-platform`)
- Deployments & StatefulSets
- ClusterIP Services
- ConfigMaps
- Persistent Volume Claims (PVC)
- Pod Anti-Affinity
- Rolling Updates

### High Availability
- Multiple replicas of the web application
- Automatic pod recreation on failure
- Pod distribution across nodes

### PostgreSQL (Stateful Workload)
- PostgreSQL deployed using `StatefulSet`
- Persistent storage using PVC
- Stable network identity
- Health-checked DB access from web app

### Application Health Checks
- **Liveness Probe**: `/health`
- **Readiness Probe**: `/health`
- **Database Health Endpoint**: `/db-health`

### Horizontal Pod Autoscaling (HPA)
- CPU-based autoscaling
- Scales between **3 to 10 pods**
- Uses Kubernetes Metrics Server

### Production-Grade Node.js App
- PostgreSQL connection pooling
- Graceful shutdown handling
- Kubernetes-friendly probes
- No single DB connection bottleneck

---

##  Project Structure
```
ha-k8s-platform/
├── Dockerfile
├── README.md
├── src/
│ ├── index.js
│ ├── package.json
│ └── package-lock.json
├── k8s/
│ ├── postgres/
│ │ ├── postgres-statefulset.yaml
│ │ └── postgres-configmap.yaml
│ ├── web/
│ │ ├── deployment.yaml
│ │ ├── service.yaml
│ │ └── hpa.yaml
│ └── services/
├── docker-compose.yml
└── kind-cluster.yaml
```
## Technologies Used

| Component | Technology |
|---------|-----------|
| Containerization | Docker |
| Orchestration | Kubernetes |
| Database | PostgreSQL 15 |
| Backend | Node.js + Express |
| Autoscaling | HPA (CPU-based) |
| Cluster | KIND |
| Metrics | Metrics Server |

---

## Validation & Testing Performed

### Pod Failure Recovery
```bash
kubectl delete pod <web-app-pod>
```
- Pod recreated automatically

## Database Connectivity Test
```
kubectl run db-test \
  --rm -it \
  --image=curlimages/curl \
  -n ha-platform -- \
  curl http://web-service/db-health
```
- Expected Output:
```
DB OK, row=<number>
```
## Rolling Update Verification
```
kubectl rollout restart deployment web-app -n ha-platform
```
- Zero downtime
- Old pods terminated gradually
- New pods started successfully

## Autoscaling Validation
```
kubectl get hpa -n ha-platform
kubectl top pods -n ha-platform
```
- HPA dynamically adjusts replicas based on CPU load.

 ## Docker Image
- The web application is packaged using a multi-stage-ready Dockerfile with:

Minimal Node.js base image

Dependency installation

Optimized runtime image





















