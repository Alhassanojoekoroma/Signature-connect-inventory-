import QRCode from 'qrcode';
import { supabase } from './supabaseClient';

/**
 * QR Code Service
 * Handles QR code generation and management
 */

export const qrService = {
  /**
   * Generate QR code image for a serial number
   * Returns data URL for immediate display
   */
  generateQRCode: async (serialNumber, productName = '') => {
    try {
      // Format: serial number only (the app will resolve it)
      const qrValue = serialNumber;

      const qrDataUrl = await QRCode.toDataURL(qrValue, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return {
        dataUrl: qrDataUrl,
        value: qrValue,
      };
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  },

  /**
   * Generate QR code as Canvas element
   */
  generateQRCodeCanvas: async (serialNumber) => {
    try {
      const canvas = await QRCode.toCanvas(serialNumber, {
        errorCorrectionLevel: 'H',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return canvas;
    } catch (error) {
      console.error('Error generating QR code canvas:', error);
      throw error;
    }
  },

  /**
   * Generate batch QR codes for printing
   * Returns array of images with metadata
   */
  generateBatchQRCodes: async (items) => {
    try {
      const qrCodes = await Promise.all(
        items.map(async (item) => {
          const qr = await qrService.generateQRCode(
            item.serial_number,
            item.product_name
          );
          return {
            serialNumber: item.serial_number,
            productName: item.product_name,
            dataUrl: qr.dataUrl,
          };
        })
      );
      return qrCodes;
    } catch (error) {
      console.error('Error generating batch QR codes:', error);
      throw error;
    }
  },

  /**
   * Generate printable PDF sheet with QR codes
   * Requires html2pdf library (optional)
   */
  generatePrintSheet: async (items, title = 'QR Code Labels') => {
    try {
      // Create HTML structure for printing
      const qrCodes = await qrService.generateBatchQRCodes(items);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10mm;
              background: white;
            }
            h1 {
              text-align: center;
              margin-bottom: 20mm;
            }
            .labels-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15mm;
              page-break-after: always;
            }
            .label {
              border: 1px solid #ccc;
              padding: 10mm;
              text-align: center;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .qr-image {
              width: 80mm;
              height: 80mm;
              margin: 5mm 0;
            }
            .product-name {
              font-weight: bold;
              font-size: 12pt;
              margin-top: 5mm;
              word-break: break-word;
            }
            .serial-number {
              font-family: monospace;
              font-size: 10pt;
              color: #666;
              margin-top: 3mm;
            }
            @media print {
              body {
                margin: 0;
                padding: 5mm;
              }
              .labels-grid {
                gap: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="labels-grid">
            ${qrCodes
              .map(
                (qr) => `
              <div class="label">
                <img src="${qr.dataUrl}" class="qr-image" alt="QR Code" />
                <div class="product-name">${qr.productName}</div>
                <div class="serial-number">${qr.serialNumber}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </body>
        </html>
      `;

      return html;
    } catch (error) {
      console.error('Error generating print sheet:', error);
      throw error;
    }
  },

  /**
   * Update item's QR code data in database
   */
  updateItemQRCode: async (serialNumber, qrCodeData) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update({ qr_code_data: qrCodeData })
        .eq('serial_number', serialNumber)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating item QR code:', error);
      throw error;
    }
  },

  /**
   * Decode QR code (parse serial from QR value)
   */
  decodeQRCode: (qrValue) => {
    // QR code contains just the serial number
    return qrValue.trim();
  },

  /**
   * Validate QR code format
   */
  isValidQRFormat: (qrValue) => {
    // Simple validation - serial numbers should not be empty
    return qrValue && qrValue.trim().length > 0;
  },
};

export default qrService;
