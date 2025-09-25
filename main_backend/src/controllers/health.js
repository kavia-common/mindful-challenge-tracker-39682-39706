const healthService = require('../services/health');

class HealthController {
  // PUBLIC_INTERFACE
  check(req, res) {
    /** Health check endpoint. */
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();
