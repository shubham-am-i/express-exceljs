// external imports
import Influx from 'influx';
import colors from 'colors';

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'excel_db',
});

// Connect to the InfluxDB server
async function connectToDatabase() {
  try {
    const names = await influx.getDatabaseNames();
    if (!names.includes('excel_db')) {
      await influx.createDatabase('excel_db');
    }
    console.log('Influx DB Connected'.bgCyan);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

export default connectToDatabase;
