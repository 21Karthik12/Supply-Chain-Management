# Supply-Chain-Management

IoT Project

Backend:

To run the backend:

-   Run `pip install -r requirements.txt`
-   Open a terminal and run the gateway using `python routers/gateway.py`
    -   This runs on port `5000` so, all the API calls from the frontend go to `localhost:5000`
-   Open one or more terminals and run the border routers like `python routers/router.py <module>`. Module can be one of the following:
    -   `Fleet`
    -   `Forecasting`
    -   `Predictive`
    -   `RFID`
    -   `Storage`
-   Make API calls (specified in the YAML file) to the gateway to perform CRUD operations on sensors.
