const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serverKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serverKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) must be set');
}

const supabase = createClient(url, serverKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

module.exports = { supabase };
