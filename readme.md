# Excel.js

Click up link: [here](https://app.clickup.com/t/85zta0cm3)

## Task

Implement an Express API endpoint to query the database and generate an Excel sheet of the results, based on user input.

## Requirements

- The endpoint which accept a device name, a group of sensors, a start time, and an end time.
- Return all the data points present in the time range in Excel format.
- The Excel file must have the following columns: Sensor, time, value.
- The rows of the Excel file should contain the data from the time range.
- The device name must be shown in a row above the headers as merged cells.

## Approach

1. Accept the user-provided parameters from the API request: deviceName, sensors, startTime, endTime.
2. Connect to the InfluxDB database.
3. Construct an InfluxDB query to retrieve data points:
   - Set the measurement to the deviceName.
   - Filter data points based on the sensors and time range.
4. Execute the query and retrieve the result set.
5. Create a new Excel workbook.
6. Add a worksheet to the workbook.
7. Set up the column headers: Sensor, Time, Value.
8. Merge cells for the device name row and add it to the worksheet.
9. Iterate over the result set:
   - Populate the worksheet with data points: Sensor, Time, Value.
10. Save the Excel workbook as a file.
11. Return the file as a response from the API endpoint.

## API Endpoint

- Request Method: POST
- Request URL: http://localhost:8000/export-data
- Query Parameters:
  1. deviceName (string): The name of the device.
  2. sensors (string): A comma-separated list of sensors.
  3. startTime (string): The start time in unix format.
  4. endTime (string): The end time in unix format.

```
GET http://localhost:8000/export-data?deviceName=DeviceName&sensors=sensor1,sensor2&startTime=2023-06-15T09:00:00Z&endTime=2023-06-15T10:00:00Z
```
