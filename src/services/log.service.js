const prisma = require("../config/db");

async function logViolation({ ip, role, endpoint, reason }) {
  try {
    await prisma.violationLog.create({
      data: {
        ip,
        role,
        endpoint,
        reason
      }
    });
  } catch (error) {
    console.error("Log error:", error);
  }
}

module.exports = {
  logViolation
};