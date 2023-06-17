// external imports
import Influx from 'influx';
import colors from 'colors';

export const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'consumption_range',
});

// Connect to the InfluxDB server
async function connectToDatabase() {
  try {
    const names = await influx.getDatabaseNames();
    if (!names.includes('consumption_range')) {
      await influx.createDatabase('consumption_range');
    }
    console.log('Influx DB Connected'.bgCyan);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

export default connectToDatabase;
