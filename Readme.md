# About
This is a template for node typescript restful APIs. 

# Database
Database utilizes postrges and Prisma as the ORM. This can be changed in the database src directory as I attempted to make it abstracted enough to keep Prisma functionality seperate.

# Architecture
Follows the service, controller, repository format to provide layered levels of data processing and accessibility.

# Future work
Adding the following features
- Authentication and middleware
- Unit testing

# Setup
### Prerequisites
- node
- yarn

### Starting
1. clone repository
2. ```yarn install```
3. Create a .env file in base of the project
4. Add environment variables - see section below.
5. ```yarn build```
6. ```npx prisma db push```
7. Start server ```yarn start```

### Environment Variables
- **Required**
- DATABASE_URL={your connection string}
- PORT={your desired port}
- FIREBASE_SERVICE_ACCOUNT_PATH={path to your firebase-auth.json file}

### Database Models
- Add model definitions to schema.prisma
- Run ```npx prisma generate```

### Database Migrations
- Place connection URL in the .env and run command ```npx prisma migrate dev --name init```
- Future migrations, first regenerate models if needed
- Run command ```npx prisma migrate dev --name {migration name}```
- Deploying to prod, use command ```npx prisma migrate deploy```

### Forcing Migrations to DB
- ```npx prisma db push```
