
import express from 'express';
import dotenv from 'dotenv';

// Import your API routes
import * as driverApi from './driver+api';
import * as userApi from './user+api';
import * as createRideApi from './create+api';
import * as getRideApi from './[id]+api';
import * as testApi from './test';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const neonConnectionString = process.env.DATABASE_URL;

app.use(express.json());

// Middleware to handle Next.js-like API routes
const handleApiRoute = (apiModule: any) => async (req: express.Request, res: express.Response) => {
  const method = req.method?.toUpperCase();
  if (method && apiModule[method]) {
    try {
      const response = await apiModule[method](req);
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API server' });
});

// Set up your API routes
app.use('/driver', handleApiRoute(driverApi));
app.use('/user', handleApiRoute(userApi));
app.post('/ride', handleApiRoute(createRideApi));
app.get('/:id', handleApiRoute(getRideApi));
app.get('/test', handleApiRoute(testApi)); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});