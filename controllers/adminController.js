const { supabase } = require('../config/supabase');
const { toApi, toDatabase, throwIfError } = require('../utils/supabaseHelpers');

const STAFF_FIELDS = [
  'name', 'role', 'phone', 'email', 'shift', 'joiningDate', 'isActive',
  'attendanceStatus', 'ordersHandled', 'lastActive', 'staffId'
];

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    throwIfError(error);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

exports.getStaff = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('staff').select('*').order('created_at');
    throwIfError(error);
    const staff = toApi(data);
    res.status(200).json({ success: true, count: staff.length, data: staff });
  } catch (err) {
    next(err);
  }
};

exports.addStaff = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .insert(toDatabase(req.body, STAFF_FIELDS))
      .select()
      .single();
    throwIfError(error);
    res.status(201).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};

exports.updateStaff = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .update(toDatabase(req.body, STAFF_FIELDS))
      .eq('id', req.params.id)
      .select()
      .single();
    throwIfError(error);
    res.status(200).json({ success: true, data: toApi(data) });
  } catch (err) {
    next(err);
  }
};

exports.deleteStaff = async (req, res, next) => {
  try {
    const { error } = await supabase.from('staff').delete().eq('id', req.params.id);
    throwIfError(error);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
