const { getSupabase } = require('../config/supabase');

const CustomerModel = {
  async findAll(filters = {}) {

    let query = getSupabase()
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    return query;
  },

  async findById(id) {
    return getSupabase()
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
  },

  async findByPhone(phone) {
    return getSupabase()
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();
  },

  async create(payload) {
    return getSupabase()
      .from('customers')
      .insert(payload)
      .select()
      .single();
  },

  async update(id, payload) {
    return getSupabase()
      .from('customers')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
  },

  async remove(id) {
    return getSupabase()
      .from('customers')
      .delete()
      .eq('id', id);
  },

  async findByContact(phoneOrObj, optionalEmail) {
    let phone;
    let email;

    if (phoneOrObj && typeof phoneOrObj === 'object') {
      phone = phoneOrObj.phone;
      email = phoneOrObj.email;
    } else {
      phone = phoneOrObj;
      email = optionalEmail;
    }

    return getSupabase()
      .from('customers')
      .select('*')
      .or(`phone.eq.${phone},email.eq.${email}`)
      .maybeSingle();
  },
    async verifyOrderAndCustomer(orderRef, phone) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderRef);
    const orderColumn = isUUID ? 'id' : 'order_number';

    
    const { data: customerRows, error: customerError } = await getSupabase()
      .from('customers')
      .select('id, name, phone')
      .eq('phone', phone)
      .limit(1); 

    if (customerError) return { error: customerError };

    
    if (!customerRows || customerRows.length === 0) {
      return { data: null, reason: 'Customer phone number not found in database.' };
    }

    const customer = customerRows[0];

    const { data: orderRows, error: orderError } = await getSupabase()
      .from('orders')
      .select('id, order_number, grand_total, status, customer_id')
      .eq(orderColumn, orderRef)
      .limit(1); // Ligtas na kukuha ng max 1 row bilang array

    if (orderError) return { error: orderError };

    // Kung walang nahanap na order
    if (!orderRows || orderRows.length === 0) {
      return { data: null, reason: 'Order reference code not found.' };
    }

    const order = orderRows[0];

   
    if (order.customer_id !== customer.id) {
      return { 
        data: null, 
        reason: `Verification failed. This order does not belong to the customer with phone number ${phone}.` 
      };
    }

    return {
      data: {
        order_id: order.id,
        order_number: order.order_number,
        grand_total: order.grand_total,
        status: order.status,
        customer: customer
      }
    };
  }
};

module.exports = { CustomerModel };