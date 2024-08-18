# Guestara intern assignment

### Setup : 
- Clone the repo.
- Run npm install.
- Start postgres, in this case via docker : 
```docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres```
-Connect via env : 
```DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"```
- cd src/database : 
```run -> npx prisma generate```
```run -> npx prisma migrate dev --name init```
```run -> npx prisma studio```
- In root directory run : 
```npm run start```
-Check out the ```rest.http``` file for sending requests or ```import the postman_collection``` from repo to postman.