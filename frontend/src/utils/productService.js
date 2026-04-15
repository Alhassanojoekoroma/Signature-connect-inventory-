import { supabase } from './supabaseClient';

/**
 * Product and Item Service
 * Handles all operations related to products and inventory items
 */

export const productService = {
  /**
   * Get all products
   */
  getAllProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   */
  getProductById: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  /**
   * Get product by name
   */
  getProductByName: async (name) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', name)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching product by name:', error);
      throw error;
    }
  },

  /**
   * Create new product (Admin only)
   */
  createProduct: async (productData, userId) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productData.name,
            category: productData.category,
            has_serial: productData.has_serial,
            unit: productData.unit || 'Pcs',
            description: productData.description,
            created_by: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Get product categories count and stats
   */
  getProductStats: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category, id')
        .then(({ data, error }) => {
          if (error) throw error;
          const stats = {};
          data.forEach((p) => {
            stats[p.category] = (stats[p.category] || 0) + 1;
          });
          return { data: stats, error: null };
        });

      return data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  },
};

export const itemService = {
  /**
   * Get all items
   */
  getAllItems: async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(
          `
          *,
          product:products(*),
          assigned_to:users(id, name, email)
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  /**
   * Get item by serial number
   */
  getItemBySerial: async (serialNumber) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(
          `
          *,
          product:products(*),
          assigned_to:users(id, name, email)
        `
        )
        .eq('serial_number', serialNumber)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error fetching item by serial:', error);
      throw error;
    }
  },

  /**
   * Get items by product ID
   */
  getItemsByProductId: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(
          `
          *,
          product:products(*),
          assigned_to:users(id, name, email)
        `
        )
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching items by product:', error);
      throw error;
    }
  },

  /**
   * Get items by status
   */
  getItemsByStatus: async (status) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(
          `
          *,
          product:products(*),
          assigned_to:users(id, name, email)
        `
        )
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching items by status:', error);
      throw error;
    }
  },

  /**
   * Create new item (requires serial number and product_id)
   */
  createItem: async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            serial_number: itemData.serial_number,
            product_id: itemData.product_id,
            status: 'IN_STORE',
            condition: itemData.condition || 'Good Condition',
            qr_code_data: itemData.qr_code_data,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  /**
   * Create multiple items (batch)
   */
  createItems: async (itemsData) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert(
          itemsData.map((item) => ({
            serial_number: item.serial_number,
            product_id: item.product_id,
            status: 'IN_STORE',
            condition: item.condition || 'Good Condition',
            qr_code_data: item.qr_code_data,
          }))
        )
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating items:', error);
      throw error;
    }
  },

  /**
   * Update item status
   */
  updateItemStatus: async (serialNumber, status, updates = {}) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({
          status,
          ...updates,
          updated_at: new Date(),
        })
        .eq('serial_number', serialNumber)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item status:', error);
      throw error;
    }
  },

  /**
   * Get inventory statistics
   */
  getInventoryStats: async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data.length,
        in_store: data.filter((i) => i.status === 'IN_STORE').length,
        in_field: data.filter((i) => i.status === 'IN_FIELD').length,
        returned: data.filter((i) => i.status === 'RETURNED').length,
        faulty: data.filter((i) => i.status === 'FAULTY').length,
        damaged: data.filter((i) => i.status === 'DAMAGED').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  },

  /**
   * Get low stock items (customizable threshold)
   */
  getLowStockItems: async (threshold = 3) => {
    try {
      const allItems = await itemService.getAllItems();
      const products = await productService.getAllProducts();

      // Group items by product and check stock levels
      const stockByProduct = {};
      allItems.forEach((item) => {
        if (item.status === 'IN_STORE') {
          stockByProduct[item.product_id] =
            (stockByProduct[item.product_id] || 0) + 1;
        }
      });

      return products.filter(
        (p) => !stockByProduct[p.id] || stockByProduct[p.id] <= threshold
      );
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw error;
    }
  },
};

export default { productService, itemService };
