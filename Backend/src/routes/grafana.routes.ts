import { Router } from 'express';
import { setupGrafana } from '../script/setupGrafana';

const grafanaRoute = () => {
  const router = Router();

  router.post('/setup', async (req, res) => {
  try {
    const uid = await setupGrafana();
    res.json({ status: 'success', uid });
  } catch (error) {
    console.error('Grafana setup error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to setup Grafana' });
  }
});

  return router;
};

export { grafanaRoute };