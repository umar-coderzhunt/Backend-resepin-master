<p align="center">

# Introduction

Resepin RESTful API is an API that allows users to read recipe information data from a database. The Food Recipe RESTful API also allows users to create, update, and delete recipe information to/from the database.

## Requirements

1. [Node Js](https://nodejs.org/en/download/)
2. [Express JS](https://expressjs.com/en/starter/installing.html)
3. [Postman](https://www.getpostman.com/)
4. Web Server (ex. localhost)
5. Code Editor (VS Code, Sublime, Atom, etc)

### Node.js

Node.js is a software that designed to develop web-based applications and is written in the syntax of the JavaScript programming language. JavaScript as a programming language that runs on the client / browser side only can be completed by Node.js. With Node.js, JavaScript can also act as a programming language that runs on the server side, such as PHP, Ruby, Perl, and so on.

Node.js can run on Windows, Mac OS X and Linux operating systems without the need for program code changes. Node.js has its own HTTP server library that make it possible to run a web server without using a web server program such as Apache or Nginx.

### Express.js

Express.js is one of the most popular web frameworks for Node.js. The complete documentation and its use which is quite easy, can make us develop various products such as web applications or RESTful API.

## Installation

1. Clone or download this repository
2. Open app's directory in CMD or Terminal.
3. Type in Terminal `npm install` to install the required packages.
4. Make a new file, **.env** and setup the file. [instruction here](#setup-env-file)
5. Turn on Web Server and PostgreSQL, (Also can be done with third-party tools like XAMPP, WAMP, etc)
6. Setup the database. [instruction here](#setup-database)
7. Open **Postman** desktop application or Chrome web extension (Install **Postman** if you haven't yet)
8. Choose HTTP Method and enter the request URL.(i.e. localhost:5000/recipe)
9. Check all **Endpoints** [here](#endpoints)

## Setup .env file

Open **.env** file on code editor and copy the code below :

```
# app
SERVER_PORT=4000

# database
DB_HOST="Your_Host"
DB_USERNAME="Your_Username"
DB_PASSWORD="Your_Password"
DB_DATABASE ="Your_Table"
DB_PORT = "Your_port_DB"


# jwt
SECRET_KEY = "secret key you"

# cloudinary
CLOUDINARY_CLOUD_NAME = "cloud name"
CLOUDINARY_API_KEY = "api key "
CLOUDINARY_API_SECRET = "secret key"

```

## API Reference

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Get all recipe

```http
  GET /food
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `search`  | `string` | **Required**. Your API key |
| `limit`   | `number` | **Required**. Your API key |
| `sort`    | `string` | **Required**. Your API key |
| `page`    | `number` | **Required**. Your API key |
