import mongoose from 'mongoose';
import config from './config';
import app from './app';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`Database is connected successfully`);
    app.listen(config.port, () => {
      console.log(`Application listening on  port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect db', error);
  }
}

main().catch(err => console.log(err));
