export const InfrastructureArchitecture = {
  ScalingLimits: {
    TargetTenants: '10,000+',
    MaxConnections: '1M concurrent',
    DataThroughput: '50k RPS',
  },
  DockerCompose: `version: '3.8'
services:
  api:
    image: market-erp-backend:latest
    deploy:
      replicas: 5
    environment:
      - DATABASE_URL=postgres://...
      - REDIS_URL=redis://...
  worker:
    image: market-erp-worker:latest
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
  name: market-erp-core
spec:
  replicas: 12
  selector:
    matchLabels:
      app: market-erp
  template:
    metadata:
      labels:
        app: market-erp
    spec:
      containers:
      - name: api
        image: gcr.io/market/erp:prod
        resources:
          limits:
            cpu: "2"
            memory: "4Gi"
`
};
