export const formatDate = (date, includeTime = false, includeSeconds = true) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let dateStr = `${year}-${month}-${day}`;

    if (includeTime) {
        const hours = date.getHours().toString().padStart(2, '0');
        const min = date.getMinutes().toString().padStart(2, '0');
        const sec = date.getSeconds().toString().padStart(2, '0');
        dateStr = `${dateStr} ${hours}:${min}${includeSeconds ? `:${sec}` : ''}`;
    }

    return dateStr;
};
