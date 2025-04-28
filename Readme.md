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
- yarn

### Starting
- clone repository
- ```yarn install```
- Create a .env file
- Add necessary variables - see section below.
- Start server ```yarn start```

### Environment Variables
- **Required**
- DATABASE_URL={your connection string}
- PORT={your desired port}

### Database Models
- Add model definitions to schema.prisma
- Run ```npx prisma generate```