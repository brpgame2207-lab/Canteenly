const { supabase } = require('../config/supabase');
const { toApi, throwIfError } = require('../utils/supabaseHelpers');

const ORDER_SELECT = `
  id,user_id,total_amount,token_number,status,payment_status,created_at,
  user:users!orders_user_id_fkey(id,name,email),
  order_items(id,quantity,price,menu_item_id,menu_item:menu_items(id,name,description,image,price))
`;

function formatOrder(order, includeUser = false) {
  const result = toApi({
    id: order.id,
    user_id: order.user_id,
    total_amount: order.total_amount,
    token_number: order.token_number,
    status: order.status,
    payment_status: order.payment_status,
    created_at: order.created_at
  });
  result.items = (order.order_items || []).map(item => ({
    _id: item.id,
    id: item.id,
    quantity: item.quantity,
    price: Number(item.price),
    menuItemId: toApi(item.menu_item || { id: item.menu_item_id })
  }));
  if (includeUser) result.userId = toApi(order.user || { id: order.user_id });
  return result;
}

async function fetchOrder(id, includeUser = false) {
  const { data, error } = await supabase.from('orders').select(ORDER_SELECT).eq('id', id).single();
  throwIfError(error);
  return formatOrder(data, includeUser);
}

exports.placeOrder = async (req, res, next) => {
  try {
    const { data, error } = await supabase.rpc('place_order_from_cart', { p_user_id: req.user.id });
    throwIfError(error);
    res.status(201).json({ success: true, data: await fetchOrder(data) });
  } catch (err) {
    if (err.message === 'Cart is empty') err.statusCode = 400;
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    throwIfError(error);
    const orders = data.map(order => formatOrder(order));
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { error } = await supabase.rpc('set_order_status', {
      p_order_id: req.params.id,
      p_status: req.body.status
    });
    throwIfError(error);
    res.status(200).json({ success: true, data: await fetchOrder(req.params.id, true) });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });
    throwIfError(error);
    const orders = data.map(order => formatOrder(order, true));
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};
