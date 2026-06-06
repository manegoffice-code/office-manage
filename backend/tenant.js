// backend/tenant.js
// Tenant middleware (kept for compatibility, not used in current routes)

const tenantFilter = (req, res, next) => {
  if (req.user && req.user.tenant_id) {
    req.tenant_id = req.user.tenant_id;
  }
  next();
};

module.exports = { tenantFilter };
