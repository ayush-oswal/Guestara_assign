# Guestara intern assignment

### Setup : 
- Clone the repo.
- Run npm install.
- Start postgres, in this case via docker : 
```docker run --name my-postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres```
- Connect via env : 
```DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"```
- cd src/database : 
```run -> npx prisma generate```
```run -> npx prisma migrate dev --name init```
```run -> npx prisma studio```
- In root directory run : 
```npm run start```
- Check out the ```rest.http``` file for sending requests or ```import the postman_collection``` from repo to postman.

## Q&A
- Which database you have chosen and why? 
Was thinking about using mongodb but as per the requirements we need to manage complex relations between categories, subcategories and items, also as there were apis to fetch all data table wise, it was convinient to seperate the 3 collections and query them. I used prisma ORM for efficient queries and schema formation.

- 3 things that you learned from this assignment? 
Prisma, database design, backend route formations.

- What was the most difficult part of the assignment?
Deciding the database and the proper schema with flexiblity.

- What you would have done differently given more time?
Would create delete routes too for all 3 models.
