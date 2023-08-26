# SmaartPass

This contains the source code of the SmartPass web app.

## Getting Started

Clone this repository using the following command:

```bash
git clone https://github.com/Babatunde13/iu-portfolio-project.git
```

## Running the Project

To run this project locally, you need to have [Node.js](https://nodejs.org/en/) installed.
You also need to have [MongoDB](https://www.mongodb.com/) installed and running on your machine.

## Generate Test Data

To generate test data, run the following command:

```bash
cd server && npm run seed
```

This will generate 10 users and their email and password will be stored in the `users.json` file in the root directory.

## Start the Servers

To run the servers, you need to start the frontend and backend servers.
Run the following commands to start the frontend server:

```bash
cd client && npm install && npm run build && npm run dev
```

This will install all the dependencies, build the Vue app, and start the server. The server will be running on port 4000.

In another terminal, run the following commands to start the backend server:

```bash
cd server && npm install && npm run build && npm run start
```

This will install all the dependencies, build the ExpressJS app, and start the server. The server will be running on port 3000.

By now, you should have both the frontend and backend servers running. You can access the web app at <http://localhost:4000>.
