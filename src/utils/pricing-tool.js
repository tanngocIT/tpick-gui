export const toLocalePrice = (price, withSymbol = false) => {
    return withSymbol ? price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : price.toLocaleString('it-IT');
};

export const sum = (items, calculation) => {
    return items.reduce((acc, item) => acc + calculation(item), 0);
};
