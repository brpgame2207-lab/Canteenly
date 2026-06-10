const { supabase } = require('../config/supabase');
const { toApi, toDatabase, throwIfError } = require('../utils/supabaseHelpers');

const INVENTORY_FIELDS = ['itemName', 'quantity', 'unit', 'threshold', 'menuItemId'];

exports.getInventory = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('inventory').select('*').order('item_name');
    throwIfError(error);
    const inventory = toApi(data);
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (err) {
    next(err);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(toDatabase(req.body, INVENTORY_FIELDS))
      .eq('id', req.params.id)
      .select()
      .single();
    throwIfError(error);
    res.status(200).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};

exports.addInventoryItem = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .insert(toDatabase(req.body, INVENTORY_FIELDS))
      .select()
      .single();
    throwIfError(error);
    res.status(201).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};
