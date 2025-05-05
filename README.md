# URL Shortening Service

## Overview

This is a URL shortening service where you enter a URL such as https://indicina.co and it returns a short URL such as http://short.est/GeAi9K. Visiting the shortened URL redirects the user to the original long URL.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)

## Setup

### Prerequisites

- Node.js and npm installed
- MySQL database

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>

   ```

2. Install the dependencies:

   ```bash
   npm install


   ```

3. Set up environment variables. Create a .env file in the root directory and add the following variables:

   ```bash
   # Server configuration
   PORT=3000
   NODE_ENV=development

   # Database configuration
   DB_USERNAME=<your_mysql_username>
   DB_PASSWORD=<your_mysql_password>
   DB_NAME=<your_database_name>
   DB_HOST=<your_database_host>
   DB_PORT=3306

   # Base URL
   BASE_URL=http://localhost:3000

   ```

4. Set up the database

   ```bash
   npm run migrate

   ```

5. Start the Server

   ```bash
    npm run start:dev

   ```

6. API Documentation

   You can view the API documentation by navigating to https://documenter.getpostman.com/view/41998970/2sB2j68q7v

## Usage

### URL Endpoints

- POST /api/v1/url/encode - Encodes a URL to a shortened URL
- POST /api/v1/url/decode - Decodes a shortened URL to its original URL
- GET /api/v1/url/statistic/{url_path} - Return basic stats of a short URL path
- GET /api/v1/url/list - List all available URLs
- GET /{url_path} - Redirect to the original long URL



## API Documentation

### Postman Doc

- You can view the API documentation by navigating to https://documenter.getpostman.com/view/41998970/2sB2j68q7v

## Scripts

### Install Dependencies

    ```bash
    npm install

    ```

### Database Migration
    ```bash
    npm run migrate

    ```

### Test

    ```bash
    npm run test

    ```

### Start

    ```bash
    npm run start:dev

    ```
