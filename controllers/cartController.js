const { supabase } = require('../config/supabase');
const { toApi, throwIfError } = require('../utils/supabaseHelpers');

const CART_SELECT = 'id,user_id,total_price,created_at,cart_items(id,quantity,menu_item_id,menu_items(*))';

async function getOrCreateCart(userId) {
  let { data, error } = await supabase.from('carts').select(CART_SELECT).eq('user_id', userId).maybeSingle();
  throwIfError(error);
  if (!data) {
    const created = await supabase.from('carts').insert({ user_id: userId }).select(CART_SELECT).single();
    throwIfError(created.error);
    data = created.data;
  }
  return formatCart(data);
}

function formatCart(cart) {
  return {
    ...toApi({ id: cart.id, user_id: cart.user_id, total_price: cart.total_price, created_at: cart.created_at }),
    items: (cart.cart_items || []).map(item => ({
      _id: item.id,
      id: item.id,
      quantity: item.quantity,
      menuItemId: toApi(item.menu_items || { id: item.menu_item_id })
    }))
  };
}

async function replaceCartItems(userId, clientItems) {
  const cart = await getOrCreateCart(userId);
  const ids = clientItems.map(item => item.id || item.menuItemId || item._id).filter(Boolean);
  const { data: menuItems, error: menuError } = await supabase.from('menu_items').select('id,price').in('id', ids);
  throwIfError(menuError);
  const prices = new Map(menuItems.map(item => [item.id, Number(item.price)]));
  const rows = clientItems
    .map(item => ({ menu_item_id: item.id || item.menuItemId || item._id, quantity: Math.max(1, Number(item.quantity) || 1) }))
    .filter(item => prices.has(item.menu_item_id))
    .map(item => ({ ...item, cart_id: cart._id }));
  const totalPrice = rows.reduce((sum, item) => sum + prices.get(item.menu_item_id) * item.quantity, 0);

  const deleted = await supabase.from('cart_items').delete().eq('cart_id', cart._id);
  throwIfError(deleted.error);
  if (rows.length) {
    const inserted = await supabase.from('cart_items').insert(rows);
    throwIfError(inserted.error);
  }
  const updated = await supabase.from('carts').update({ total_price: totalPrice }).eq('id', cart._id);
  throwIfError(updated.error);
  return getOrCreateCart(userId);
}

exports.getCart = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: await getOrCreateCart(req.user.id) });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const current = cart.items.map(item => ({ id: item.menuItemId._id, quantity: item.quantity }));
    const existing = current.find(item => item.id === req.body.menuItemId);
    if (existing) existing.quantity += Number(req.body.quantity) || 1;
    else current.push({ id: req.body.menuItemId, quantity: Number(req.body.quantity) || 1 });
    res.status(200).json({ success: true, data: await replaceCartItems(req.user.id, current) });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const items = cart.items
      .filter(item => item.menuItemId._id !== req.params.itemId)
      .map(item => ({ id: item.menuItemId._id, quantity: item.quantity }));
    res.status(200).json({ success: true, data: await replaceCartItems(req.user.id, items) });
  } catch (err) {
    next(err);
  }
};

exports.syncCart = async (req, res, next) => {
  try {
    if (!Array.isArray(req.body.items)) {
      return res.status(400).json({ success: false, message: 'Items must be an array' });
    }
    res.status(200).json({ success: true, data: await replaceCartItems(req.user.id, req.body.items) });
  } catch (err) {
    next(err);
  }
};
