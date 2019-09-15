# In-Memory User CRM Nodejs Server Solution

## About

A simple server to handle the beloved "user".

## Requirements

- NodeJS 8+

## Setup

- `npm install`

## Run

- `node index.js`
  Or alternatively
- `nodemon index.js`

## HTTP Requests

- POST: `/users`
  Create user. Example request body object: {
  "username": "...",
  "name": "...",
  "address": "...",
  "password":"...",
  "birth_year": ...
  }

- GET: `/users/<unix_timestamp>`
  Get all user with password_last_modified timestamp > passed in value in seconds

- POST: `/users/change-password`
  Change user password. Example request body object: {
  "username": "...",
  "password":"...",
  "newPassword": "..."
  }

## Contributing

PRs are welcome. ☺️

## License

MIT
