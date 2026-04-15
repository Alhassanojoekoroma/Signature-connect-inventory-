/**
 * API Service Layer
 * Provides centralized access to all Supabase services
 * Services are directly imported from their respective modules
 */

// Import all services
export { default as authService } from './authService';
export { productService, itemService } from './productService';
export { transactionService } from './transactionService';
export { default as qrService } from './qrService';
export { staffService, auditLogService } from './staffService';
export { default as activityLogService } from '../services/activityLogService';

// Legacy support - users can still call these, but they now use Supabase
export const authAPI = authService;
export const sheetsAPI = {
  // Products
  getProducts: () => productService.getAllProducts(),
  
  // Transactions
  getTransactions: () => transactionService.getAllTransactions(),
  
  // Items
  addStock: async (data) => {
    // Creates an item and logs transaction
    const item = await itemService.createItem(data);
    await transactionService.addStockTransaction(item.serial_number, data.user_id, data);
    return item;
  },
  
  issueItem: async (data) => {
    // Creates issue transaction
    return transactionService.issueTransaction(
      data.serial_number,
      data.user_id,
      data
    );
  },
  
  returnItem: async (data) => {
    // Creates return transaction
    return transactionService.returnTransaction(
      data.serial_number,
      data.user_id,
      data
    );
  },
};

export const qrAPI = {
  generateQR: (serial) => qrService.generateQRCode(serial),
  generateBatch: (serials) =>
    Promise.all(serials.map((s) => qrService.generateQRCode(s))),
};

export default {
  authService,
  productService,
  itemService,
  transactionService,
  qrService,
  staffService,
  auditLogService,
};
