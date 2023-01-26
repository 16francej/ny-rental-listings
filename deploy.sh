docker build -t 16francej/ny-rentals:latest .
docker push 16francej/ny-rentals:latest

kubectl apply -f config/kube/deployment.yml
kubectl rollout restart deployment ny-rental-listings
kubectl get deployment
