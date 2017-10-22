Setting up a Nginx Ingress with Kubernetes on bare-metal servers
22/10/2017
A simple guide on how to setup a reverse proxy for your Kubernetes services on port 80 using Nginx on Kubernetes.

# What will this achieve?
Say you have a service deployed on your Kubernetes cluster called `node-web-server`, it exposes a port 300 and to keep this simple this is deployed in the `default` namespace. This means that your other services can talk to this service on `node-web-server.default:3000` inside the cluster. Now you want to give external access to this service so that your friends or co-workers can access it, for example on `node-web-server.mydomain.com`.

TLDR: `node-web-server.mydomain.com -> node-web-server.default:3000` using only YAML config.

# Why did you create this guide, isn't this simple?
Most of the information I could find on the internet was using clusters deployed on GKE or AWS which allow you to deploy an Nginx Ingress as type `LoadBalancer`. This means that the external GKE or AWS load balancer will do the heavy work of making your Ingress available on port 80. I was unable to find a simple guide that talked you through actually getting your Nginx to expose a port 80 on a bare metal cluster, they all seemed to leave me in this situation:

`node-web-server.mydomain.com:32500 -> node-web-server.default:3000`

Which quite frankly is ugly, I wanted to expose my app on port 80!

# Requirements

- Root access on the Kubernetes master node
- A domain with an A record setup to point to the IP address of one of the nodes in the Kubernetes cluster

# Assumptions

These are the assumptions I have made in the article, you can simply replace this in any of the code/config listed on this page.

- You are using the `default` namespace
- The service you want to expose is called `node-web-server` and exposes a port `3000`
- The A-Record is setup on `node-web-server.mydomain.com`

# First steps
The crucial step to all of this is giving your cluster permission to use a NodePort of port 80, *beware* when doing this as it does mean you are exposing services on privileged ports.

1. SSH into the Kubernetes master
2. Open `/etc/kubernetes/manifests/kube-apiserver.yaml` for editing with your favourite text editor: `vim`, `emacs` or `nano`, you decide!
3. In the command section where there is a list of arguments, add to the bottom of that list `- --service-node-port-range=80-32767`
4. Save and close the file
5. `reboot` the Kubernetes master.
6. Wait for it to come back online and for `kubectl get nodes` to say it is ready again.

# Deploying the Nginx instance
Now we've allowed services to run on a NodePort of 80 we can deploy the Nginx service! This will setup a default Nginx ingress based on: `https://github.com/kubernetes/ingress-nginx/blob/master/deploy/README.md`.

Execute the following commands, this will setup a new namespace `ingress-nginx` and setup the Nginx default config and a default HTTP backend in this namespace.

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/namespace.yaml | kubectl apply -f -`

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/default-backend.yaml | kubectl apply -f -`

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/configmap.yaml | kubectl apply -f -`

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/tcp-services-configmap.yaml | kubectl apply -f -`

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/udp-services-configmap.yaml | kubectl apply -f -`

If you have RBAC setup on your cluster (most versions of Kubernetes >=1.7 do) then execute the following commands to deploy the Nginx instance:

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/rbac.yaml | kubectl apply -f -`

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/with-rbac.yaml | kubectl apply -f -`

For non-RBAC execute the following command:

`curl https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/without-rbac.yaml | kubectl apply -f -`

# Deploying the Nginx service

Now the most important step, this is my custom config which will allow you to expose the Nginx instance on port 80.

Save the following to a file `nginx-service.yml`

```
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-nginx
  namespace: ingress-nginx
spec:
  type: NodePort
  ports:
  - name: http
    port: 80
    targetPort: 80
    nodePort: 80
    protocol: TCP
  selector:
    app: ingress-nginx
```

Apply this to the cluster with `kubectl apply -f nginx-service.yml`

# Creating an ingress rule for your service

Save the following to a file named `ingress.yml`:

```
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: node-web-server
  namespace: default
spec:
  rules:
  - host: node-web-server.mydomain.com
    http:
      paths:
      - path: "/"
        backend:
          serviceName: node-web-server
          servicePort: 3000
```

Apply this to the cluster with `kubectl apply -f ingress.yml`

# Exposing more services

To expose more services all you need to do is add another A record for that service e.g `service2.mydomain.com` and then deploy another `ingress.yml` (seen above) but with a different `spec.rules[0].host` and different `metadata.name`, `spec.rules[0].http.paths[0].backend.serviceName` and `spec.rules[0].http.paths[0].backend.servicePort`. Simple!

I usually find it easier however to setup a wildcard, e.g for my `dev` cluster I setup an A record for `*.dev.mydomain.com` and then I can deploy Ingress rules using Ansible to automatically forward my new services!

# Troubleshooting
If you have issues, I'm available by [email](mailto:will@will3942.com).
