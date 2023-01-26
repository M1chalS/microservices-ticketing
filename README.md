# Ticketing App
A Webapp made by following Stephen Grinder microservices course. 
App is build using ExpressJS, Typescript, docker with kubernetes and MongoDB.

# Installation
1. Make sure you have Docker Desktop and NodeJS installed.
2. Install https://skaffold.dev
3. Enable kubernetes in settings of your Docker Desktop
4. Copy this into your console `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml`
5. Add `ticketing.dev` to your systems hosts file
6. Run `scaffold dev` in project root directory
7. Everything's setup!