import { GoogleSpreadsheet } from 'google-spreadsheet';
import { sum } from 'utils/pricing-tool';

const writeToGoogleSheetPrivate = async (sheetId, order, shop) => {
    const doc = new GoogleSpreadsheet(sheetId);
    doc.useServiceAccountAuth({
        client_email: 'google-sheet@tpick-vn.iam.gserviceaccount.com',
        // private_key: process.env.REACT_APP_GSHEET_KEY.replace(/\\n/g, '\n'),
        private_key: Buffer.from(process.env.REACT_APP_GSHEET_KEY, 'base64').toString('ascii')
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle.RawOrderDetails;
    const dataRows = order.subOrders.map((subOrder) => ({
        timestamp: new Date().getTime().toString(),
        shop: shop.name,
        orderId: order.id,
        originalPrice: sum(subOrder.items, (x) => x.quantity * x.price),
        finalPrice: sum(subOrder.items, (x) => x.quantity * x.price),
        user: subOrder.owner.name,
        items: subOrder.items.map((x) => `${x.quantity}x ${x.name}`).join('\n')
        // rowIndex: `=IF(INDIRECT("A" & row())<>"";row();"")`
    }));

    await sheet.addRows(dataRows, {
        insert: true
    });
    await sheet.insertDimension('ROWS', {
        startIndex: 1,
        endIndex: 2
    });
};

export const writeToGoogleSheet = async (enqueueSnackbar, setGSheetProcessing, sheetId, order, shop) => {
    try {
        setGSheetProcessing(true);

        await writeToGoogleSheetPrivate(sheetId, order, shop);
        enqueueSnackbar(`Lưu thành công!`, { variant: 'success' });
    } catch (error) {
        enqueueSnackbar(`Lưu thất bại! ${error}`, { variant: 'warning' });
    } finally {
        setGSheetProcessing(false);
    }
};
