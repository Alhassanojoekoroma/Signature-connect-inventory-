const { google } = require('googleapis');

let sheetsService = null;
let initialized = false;

// Initialize Google Sheets API
const initializeSheets = async () => {
  if (initialized) return sheetsService;

  try {
    let credentials;

    // Try to load credentials from environment variable or file
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    } else if (process.env.GOOGLE_CREDENTIALS_PATH) {
      const fs = require('fs').promises;
      const credentialsFile = await fs.readFile(process.env.GOOGLE_CREDENTIALS_PATH, 'utf-8');
      credentials = JSON.parse(credentialsFile);
    } else {
      throw new Error('Google credentials not found. Check .env file.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    sheetsService = google.sheets({ version: 'v4', auth });
    initialized = true;
    console.log('✅ Google Sheets API connected');
    return sheetsService;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error.message);
    throw error;
  }
};

// Get all products from Main Sheet
const getProducts = async () => {
  try {
    const sheets = await initializeSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID not set in environment');
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Main Sheet!A:H', // Adjust range to your sheet
    });

    const rows = response.data.values || [];
    const headers = rows[0] || [];
    const products = [];

    // Parse rows into objects
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      products.push({
        name: row[0] || '',
        unit: row[1] || 'Pcs',
        openingStock: parseInt(row[2]) || 0,
        totalReceived: parseInt(row[3]) || 0,
        totalIssued: parseInt(row[4]) || 0,
        totalReturned: parseInt(row[5]) || 0,
        faultyUnits: parseInt(row[6]) || 0,
        outstandingBalance: parseInt(row[7]) || 0,
      });
    }

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Add issue record to Sheet 3: Supplied Field Team
const addIssueRecord = async (data) => {
  try {
    const sheets = await initializeSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const today = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

    const values = [[
      today,
      data.product,
      data.category || '',
      'Pcs',
      data.qty || 1,
      data.serial || '',
      data.customer || '',
      data.issuedTo || '',
      data.authorizedBy || '',
      'Active - In Field',
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Supplied Field Team!A:J',
      valueInputOption: 'USER_ENTERED',
      values,
    });

    console.log('✅ Issue record added to Sheets');
    return response.data;
  } catch (error) {
    console.error('Error adding issue record:', error);
    throw error;
  }
};

// Add return record to Sheet 2: Items Received
const addReturnRecord = async (data) => {
  try {
    const sheets = await initializeSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const today = new Date().toLocaleDateString('en-GB');

    const values = [[
      today,
      data.product,
      'Returned from Field',
      'Pcs',
      1,
      data.serial || '',
      data.returnedBy || '',
      data.receivedBy || '',
      data.condition || 'Good Condition',
    ]];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Items Received!A:I',
      valueInputOption: 'USER_ENTERED',
      values,
    });

    console.log('✅ Return record added to Sheets');
    return response.data;
  } catch (error) {
    console.error('Error adding return record:', error);
    throw error;
  }
};

// Add stock record to Sheet 2: Items Received
const addStockRecord = async (data) => {
  try {
    const sheets = await initializeSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const today = new Date().toLocaleDateString('en-GB');

    // For multiple serials, create multiple rows
    const serials = data.serial
      ? data.serial.split(',').map(s => s.trim())
      : [''];

    const values = serials.map(serial => [
      today,
      data.product,
      'New Stock Received',
      'Pcs',
      serials.length > 1 ? 1 : data.qty,
      serial,
      '',
      data.receivedBy || '',
      data.condition || 'New in Box',
    ]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Items Received!A:I',
      valueInputOption: 'USER_ENTERED',
      values,
    });

    console.log('✅ Stock record added to Sheets');
    return response.data;
  } catch (error) {
    console.error('Error adding stock record:', error);
    throw error;
  }
};

// Get transactions (for activity feed)
const getTransactions = async (limit = 10) => {
  try {
    const sheets = await initializeSheets();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Get from Items Received
    const response1 = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Items Received!A:I',
    });

    // Get from Supplied Field Team
    const response2 = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Supplied Field Team!A:J',
    });

    const rows1 = response1.data.values || [];
    const rows2 = response2.data.values || [];

    const transactions = [];

    // Parse Items Received
    for (let i = 1; i < rows1.length; i++) {
      const row = rows1[i];
      transactions.push({
        date: row[0],
        product: row[1],
        type: row[2],
        serial: row[5] || 'N/A',
        by: row[7] || row[6],
      });
    }

    // Parse Supplied Field Team
    for (let i = 1; i < rows2.length; i++) {
      const row = rows2[i];
      transactions.push({
        date: row[0],
        product: row[1],
        type: 'Issued',
        serial: row[5] || 'N/A',
        by: row[7],
      });
    }

    // Sort by date (most recent first) and limit
    return transactions.slice(0, limit).reverse();
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

module.exports = {
  initializeSheets,
  getProducts,
  addIssueRecord,
  addReturnRecord,
  addStockRecord,
  getTransactions,
};
