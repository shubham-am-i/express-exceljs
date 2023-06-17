import moment from 'moment';
import pkg from 'exceljs';
const { Workbook } = pkg;
// local imports
import { influx } from '../config/db.js';

export const csvExport = (req, res) => {
  let { device, sensors, startTime, endTime } = req.query;

  // Split the sensor field value using a comma as the delimiter
  const sensorArray = sensors && sensors.split(',').map((sensor) => sensor.trim());

  if (!device | !startTime | !endTime | (sensorArray === undefined)) {
    res.status(400).json({
      status: 'fail',
      msg: 'Please provide all values',
    });

    return;
  }
  startTime = moment(startTime).valueOf() * 1000000;
  endTime = moment(endTime).valueOf() * 1000000;

  // console.log(moment(1686892001270).format('YYYY-MM-DD HH:mm:ss a'));
  console.log(moment(startTime).format('YYYY-MM-DD HH:mm:ss a'));
  console.log(moment(endTime).format('YYYY-MM-DD HH:mm:ss a'));

  const calculatePoints = async (device, sensorArray, startTime, endTime) => {
    try {
      const condition = sensorArray.map((sensor) => `sensor = '${sensor}'`).join(' OR ');
      const query = `
    SELECT *
    FROM ${device}
    WHERE (${condition})
      AND time >= ${startTime}
      AND time <= ${endTime}
    
    `;

      console.log(query);
      const rows = await influx.query(query);
      // console.log(rows);

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('data-points');

      worksheet.columns = [
        { header: 'Sensor', key: 'sensor', width: 15 },
        { header: 'Time', key: 'time', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
      ];

      // Merge cells for device name
      const deviceNameCell = worksheet.getCell('A1');
      worksheet.mergeCells('A1:C1');
      deviceNameCell.value = device;

      // Set alignment for device name cell
      deviceNameCell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Set the headers in the worksheet
      worksheet.getRow(2).values = ['Sensor', 'Time', 'Value'];

      worksheet.getRow(2).eachCell((cell) => {
        cell.font = { bold: true };
      });

      // Add the data rows to the worksheet
      let rowIndex = 3;
      rows.forEach((row) => {
        const { sensor, time, value } = row;
        worksheet.getCell(`A${rowIndex}`).value = sensor;
        worksheet.getCell(`B${rowIndex}`).value = moment(time).format('YYYY-MM-DD HH:mm:ss a');
        worksheet.getCell(`C${rowIndex}`).value = value;
        rowIndex++;
      });

      // Send the Excel file as a response
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename="data-points.xlsx"');
      await workbook.xlsx.write(res);

      res.end();
    } catch (error) {
      console.error('Error exporting data:', error.message);
      res.status(500).json({
        status: 'error',
        msg: 'An error occurred while exporting data',
      });
    }
  };

  calculatePoints(device, sensorArray, startTime, endTime);
};
