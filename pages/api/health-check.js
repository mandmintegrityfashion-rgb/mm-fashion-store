/**
 * Health check endpoint to verify service availability
 */
export default function handler(req, res) {
  try {
    res.status(200).json({ 
      status: "ok",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "error",
      message: "Service unavailable"
    });
  }
}
