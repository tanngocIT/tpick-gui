export const toLocalePrice = (price) => {
    return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
};

export const sum = (items, calculation) => {
    return items.reduce((acc, item) => acc + calculation(item), 0);
};
