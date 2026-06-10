const { supabase } = require('./supabase');

const connectDB = async () => {
  try {
    const { error } = await supabase.from('menu_items').select('id').limit(1);
    if (error) throw error;
    console.log('Supabase connected');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
