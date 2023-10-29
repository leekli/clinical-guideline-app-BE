const mongoose = require('mongoose');

// Database connection
if (process.env.NODE_ENV === 'development') {
  mongoose.connect(process.env.DATABASE_URL);

  const db = mongoose.connection;

  db.on('connected', () =>
    console.log('⚡️ Now connected to the Development Database'),
  );

  db.on('open', () => console.log('🚪 Development Database connection open'));

  db.on('error', (error) => console.error(error));
} else if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.DATABASE_URL);

  const db = mongoose.connection;

  db.on('connected', () =>
    console.log('⚡️ Now connected to the Test Database'),
  );

  db.on('open', () => console.log('🚪 Test Database connection open'));

  db.on('error', (error) => console.error(error));
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.DATABASE_URL);

  const db = mongoose.connection;

  db.on('connected', () =>
    console.log('⚡️ Now connected to the Production Database'),
  );

  db.on('open', () => console.log('🚪 Production Database connection open'));

  db.on('error', (error) => console.error(error));
}
