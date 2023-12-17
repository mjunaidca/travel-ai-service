# Travel Assistant Complete MicroService

- FastAPI Backend To Manage and Scale Microservice
- A Simple Streamlit Frontend to test your MVP

## Overview

This Travel Assistant Application is designed to provide users with an interactive and informative experience related to travel destinations.

It features a user-friendly interface for exploring various locations and utilizes a Streamlit frontend coupled with a FastAPI backend.

## Features

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