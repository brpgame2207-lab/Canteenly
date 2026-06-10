const { supabase } = require('../config/supabase');
const { toApi, toDatabase, throwIfError } = require('../utils/supabaseHelpers');

const MENU_FIELDS = [
  'name', 'description', 'category', 'price', 'image', 'available', 'mealType',
  'cuisineStyle', 'dietType', 'beverageType', 'isComboOffer'
];

exports.getMenuItems = async (req, res, next) => {
  try {
    let query = supabase.from('menu_items').select('*').order('created_at');
    for (const [field, value] of Object.entries(req.query)) {
      const dbField = toDatabase({ [field]: value }, [field]);
      const [key, convertedValue] = Object.entries(dbField)[0] || [];
      if (key) query = query.eq(key, convertedValue === 'true' ? true : convertedValue === 'false' ? false : convertedValue);
    }
    const { data, error } = await query;
    throwIfError(error);
    const items = toApi(data);
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.addMenuItem = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(toDatabase(req.body, MENU_FIELDS))
      .select()
      .single();
    throwIfError(error);
    res.status(201).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(toDatabase(req.body, MENU_FIELDS))
      .eq('id', req.params.id)
      .select()
      .single();
    throwIfError(error);
    res.status(200).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
    throwIfError(error);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
