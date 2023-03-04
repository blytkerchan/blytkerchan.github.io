# Test server

Test server for the Phoenix UI

## API

The API is described in openapi.yml

## Running the server

Create a swarm if you don't already have one (`docker service ls` will tell you):
```
docker swarm init 
```

Deploy the stack
```
docker stack deploy -c ./stack.yml
```

Create a default user
```
npm run insert-user user VeryComplexPassword
```

The start the server
```
npm run start-dev-server
```
