# Supply-Chain-Management

IoT Project

Backend:

To run the backend:

-   Run `pip install -r requirements.txt`
-   Open a terminal and run the gateway using `python routers/gateway.py`
    -   This runs on port `5000` and all the API calls from the frontend go to `localhost:5000`
-   Open one or more terminals and run the border routers like `python routers/router.py <moduleId> <module> <port> `:
    -   `python routers/router.py 1 Fleet 5001`
    -   `python routers/router.py 2 Forecasting 5002`
    -   `python routers/router.py 3 Predictive 5003`
    -   `python routers/router.py 4 RFID 5004`
    -   `python routers/router.py 5 Storage 5005`
-   The moduleId, module and port are hardcoded as of now and correspond to each other. So, do not change the above commands while running them.
    -   (You can run any number of them though)
-   Make API calls (specified in the YAML file) to the gateway to make CRUD operations on sensors.
