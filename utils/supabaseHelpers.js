const FIELD_MAP = {
  created_at: 'createdAt',
  updated_at: 'updatedAt',
  user_id: 'userId',
  menu_item_id: 'menuItemId',
  order_id: 'orderId',
  total_price: 'totalPrice',
  total_amount: 'totalAmount',
  token_number: 'tokenNumber',
  payment_status: 'paymentStatus',
  payment_method: 'paymentMethod',
  transaction_id: 'transactionId',
  item_name: 'itemName',
  meal_type: 'mealType',
  cuisine_style: 'cuisineStyle',
  diet_type: 'dietType',
  beverage_type: 'beverageType',
  is_combo_offer: 'isComboOffer',
  staff_id: 'staffId',
  joining_date: 'joiningDate',
  is_active: 'isActive',
  attendance_status: 'attendanceStatus',
  orders_handled: 'ordersHandled',
  last_active: 'lastActive',
  id_number: 'idNumber',
  profile_type: 'type',
  year_semester: 'yearSemester'
};

const REVERSE_FIELD_MAP = Object.fromEntries(
  Object.entries(FIELD_MAP).map(([database, api]) => [api, database])
);

function toApi(row) {
  if (row === null || row === undefined) return row;
  if (Array.isArray(row)) return row.map(toApi);
  if (typeof row !== 'object') return row;

  return Object.entries(row).reduce((result, [key, value]) => {
    if (key === 'id') {
      result._id = value;
      result.id = value;
    } else {
      result[FIELD_MAP[key] || key] = toApi(value);
    }
    return result;
  }, {});
}

function toDatabase(payload, allowedFields = []) {
  return allowedFields.reduce((result, field) => {
    if (payload[field] !== undefined) {
      result[REVERSE_FIELD_MAP[field] || field] = payload[field];
    }
    return result;
  }, {});
}

function throwIfError(error) {
  if (!error) return;
  const err = new Error(error.message);
  err.code = error.code;
  err.details = error.details;
  err.hint = error.hint;
  throw err;
}

module.exports = { toApi, toDatabase, throwIfError };
