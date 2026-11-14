export const InfrastructureArchitecture = {
  ScalingLimits: {
    TargetTenants: '10,000+',
    MaxConnections: '1M concurrent',
    DataThroughput: '50k RPS',
  },
  DockerCompose: `version: '3.8'
services:
  api:
    image: b2b-crm-backend:latest
    deploy:
      replicas: 5
    environment:
      - DATABASE_URL=postgres://...
      - REDIS_URL=redis://...
  worker:
    image: b2b-crm-worker:latest
    deploy:
      replicas: 10
  redis:
    image: redis:7-alpine
  postgres:
    image: postgres:15
`,
  Kubernetes: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: b2b-crm-core
spec:
  replicas: 12
  selector:
    matchLabels:
      app: b2b-crm
  template:
    metadata:
      labels:
        app: b2b-crm
    spec:
      containers:
      - name: api
        image: gcr.io/b2b/crm:prod
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
`
};
