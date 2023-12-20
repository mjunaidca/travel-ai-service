# Travel Assistant Complete MicroService

- FastAPI Backend To Manage and Scale Microservice
- A Simple Streamlit Frontend to test your MVP
- Save and Update Client Chat in Neon Postgress Database

Note: To run Gemini Endpoints first setup your google vertex ai account
```! pip3 install --upgrade --user google-cloud-aiplatform```
Locally Setup
```https://cloud.google.com/sdk/docs/initializing```


# Table of Contents

1. [Travel Assistant Complete MicroService](#travel-assistant-complete-microservice)
2. [Overview](#overview)
3. [Features](#features)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Setup and Running the Application](#setup-and-running-the-application)
   - [Streamlit Frontend](#streamlit-frontend)
   - [FastAPI Backend Service](#fastapi-backend-service)
7. [Usage](#usage)
8. [Containorization & Deployment](#containorization-&-deployment)
   - [1. Backend V0 - Create Docker image and Deplpoy on Google Cloud Run](#1.-backend---create-docker-image-and-deplpoy-on-google-cloud-run)
8. [Containorization & Deployment](#containorization-&-deployment)
   - [2. Backend V1 - Gemini Streaming Update](#2.-gemini-streaming-endpoint-update)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

## Overview

This Travel Assistant Application is designed to provide users with an interactive and informative experience related to travel destinations.

It features a user-friendly interface for exploring various locations and utilizes a Streamlit frontend coupled with a FastAPI backend.

## Features

1. Open AI Assistants API Implementation
2. GEMINI STREAMING & FUNCTION CALLING Implementation

gemmini => fastapi backend => nextjs frontend (fully streamed response)

- Interactive map to explore travel destinations.
- Real-time data fetching and display using FastAPI.
- Easy-to-navigate user interface with Streamlit.

## Prerequisites

Before running the application, ensure you have the following installed:

- Python 3.6 or higher
- Streamlit
- FastAPI
- Uvicorn

## Installation

Clone the repository to your local machine:

## Environment Variables Setup

Rename .env.template to .env and add your API Keys and Database URLs there. Create an issue or feel free to message me if you face any issue while setting up the application

## Setup and Running the Application

Install the required Python packages:

```
pip install -r requirements.txt
```

### Streamlit Frontend

1. Navigate to the streamlit directory containing `app.py`.
2. Run the Streamlit application using the following command:
   ```
   streamlit run app.py
   ```

Access the frontend at: `http://localhost:8501/`

### FastAPI Backend Service

1. Go to the `backend -> src` directory.
2. Start the FastAPI server by running:

   ```
   uvicorn main:app
   ```

   Test the backend directly by making following POST request in PostMan or any API testing software.

   `http://localhost:8000/travel_assistant?prompt="Share 2 places to visit in UAE"`

Ensure that both the frontend and backend services are running simultaneously for the application to function properly.

## Usage

With both the frontend and backend services running, access the Streamlit application in your web browser and interact with the travel assistant's features.

## Containorization & Deployment

### 1. Backend - Create Docker image and Deplpoy on Google Cloud Run

Let's create a docker image first and run the frontend using a container running from this image.

Next we will push the image and deply our backend on Google Run

1. Build Docker Image

`docker build -t travel_ai_service .`

For Mac M2 Users use this command instead: `docker buildx build --platform linux/amd64 -t <Image Name> .`

2. View your Image

docker images

3.  Run the Contianer for thus Image

```
docker run --env-file .env  -d --name 2bd90a3c026f -p 80:80 travel_ai_assistant
```

4.  Tag Your Image and Push it on Docker Hub

```
docker tag travel_ai_assistant mjunaidca/travel_ai_assistant:latest
```

```
 docker push mjunaidca/travel_ai_assistant:latest
```

5. Deply your service on Google Cloud

Through Cli

```
 gcloud run deploy ai-travel-assistant --image mjunaidca/travel_ai_assistant:latest
```

Then Go to Google Cloud and Click on "Edit & Deply New Revision"

Add your Environment Variables and change the port from 8080 to 80 (this is what we configured in dockerfile).

Or you can directly visit Google Run and click on Create a Service. Fill in the details to deploy your docker image

6. Now Get your Google Deplyment URL and replace streamlit localhost:8000 port backend calls with it.

Firstly past the url in browser and you will see ""top here"" text. Next repalce it with streamlit

### 1 B. Backend V1 - Gemini Streaming Update

Get your Google Cloud Project Service API Keys. Download them in json format and
store in the backend directory.

We pass them at runtime after building image to run the container locally.

Always include them in .gitignore and .dockerignore. ,I accidently exposed them docker hub before ***

1. Build Docker Image

`docker build -t travel_ai_service .`

For Mac M2 Users use this command instead: 
```
 docker buildx build --platform linux/amd64 -t mjunaidca/travel_ai_assistant:v1 .
 ```

2. View your Image

docker images

3.  Run the Contianer for thus Image

```
 docker run --env-file .env -d --name travel_ai_assistant -p 80:80 -v /Users/mjs/Documents/GitHub/genai_fastapi/travel_ai_service/backend/travel-ai-gauth.json:/app/travel-ai-gauth.json -e GOOGLE_APPLICATION_CREDENTIALS=/app/travel-ai-gauth.json mjunaidca/travel_ai_assistant:v1```

4.  Test Locally and then Push it on Docker Hub

Is API Working?
http://localhost:80

Are Gemini Endpoints Working?
http://localhost/gemini_streaming_travel_ai/?query=%22hello%22
http://localhost/gemini_streaming_travel_ai/mapstate


For OpenAi it's Post request using postman

http://localhost:80/travel_assistant/?prompt="Share 2 places to visit in UAE"

```
 docker push mjunaidca/travel_ai_assistant:v1
```

5. Deply your service on Google Cloud

Through Cli

```
 gcloud run deploy ai-travel-assistant --image mjunaidca/travel_ai_assistant:latest
```

Then Go to Google Cloud and Click on "Edit & Deply New Revision"

Add your Environment Variables and change the port from 8080 to 80 (this is what we configured in dockerfile).

Or you can directly visit Google Run and click on Create a Service. Fill in the details to deploy your docker image

6. Now Get your Google Deplyment URL and replace streamlit localhost:8000 port backend calls with it.

Firstly past the url in browser and you will see ""top here"" text. Next repalce it with streamlit


### 2. Stream - Simple deply on Streamlit Cloud

### 3. NextJs - Create Docker image and Deplpoy on Google Cloud Run

Why not vercel: Vercel default inocation timeout is 10.01 seconds. Using edge we can increase it to 25 seconds and on top of it using streaming we can increase to to infinite time.

Here average response time with function calling is 30-40s so my plan is to dockerize and deply this on google cloud as well.

```
docker buildx build --platform linux/amd64 -t nextjs_travel_ai .

docker images

docker run --env-file .env -d --name 4f04288c45a8 -p 3000:8000 nextjs_travel_ai

verify the containor is running and no error occured

docker ps

docker tag nextjs_travel_ai mjunaidca/nextjs_travel_ai:latest

docker push mjunaidca/nextjs_travel_ai:latest

gcloud run deploy nextjs-travel-ai --image mjunaidca/nextjs_travel_ai:latest
```

## Contributing

Contributions to this project are welcome. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For any additional questions or comments, please contact the project maintainers.

---

Enjoy exploring the world with the Travel Assistant Application!

---

Enjoy your virtual travel assistant experience!
