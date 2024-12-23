# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

### Install Docker:
Ensure Docker is installed on the remote system. 

### AfterInstallation, check if docker daemon is running in the terminal:
docker info

### Then pull the image:
docker pull mohith1998/news-website:latest

### Then run the container:
docker run -d -p 8080:80 mohith1998/news-website:latest

### Then you can check using the link:
http://localhost:8080