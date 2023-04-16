// 移动
exports.move = ({ list, _id, sort }) => {
    let NEW_INDEX = -1;
    let OLD_INDEX = -1;
    let isRise = true;
    let updataList = [];
    sort = sort + 1;

    if (sort > list.length) {
        sort = list.length;
    } else if (sort < 1) {
        sort = 1;
    }

    NEW_INDEX = sort - 1;

    list.forEach((item, index) => {
        if (item._id.toString() === _id) {
            OLD_INDEX = index;
            isRise = item.sort > sort;
            item.sort = isRise ? sort - 0.5 : sort + 0.5;
        }
    });

    if (NEW_INDEX === OLD_INDEX) {
        return [];
    }
    list.sort((a, b) => a.sort - b.sort);
    list.forEach((item, index) => {
        item.sort = index + 1;
        if (isRise) {
            if (NEW_INDEX <= index && index <= OLD_INDEX) {
                console.log(isRise, item);
                updataList.push({
                    updateMany: {
                        filter: { _id: item._id },
                        update: { sort: item.sort },
                    },
                });
            }
        } else {
            if (OLD_INDEX <= index && index <= NEW_INDEX) {
                console.log(isRise, item);
                updataList.push({
                    updateMany: {
                        filter: { _id: item._id },
                        update: { sort: item.sort },
                    },
                });
            }
        }
    });

    return updataList;
};

exports.remove = ({ list, _id, sort }) => {
    const newList = [];
    let oldTask = null;
    list.forEach((item) => {
        if (item._id.toString() === _id) {
            oldTask = item;
        }
        if (item.sort > sort) {
            newList.push({
                updateMany: {
                    filter: { _id: item._id },
                    update: { sort: item.sort - 1 },
                },
            });
        }
    });

    return { newList, oldTask };
};

exports.add = ({ list, sort }) => {
    const newList = [];
    list.forEach((item) => {
        if (item.sort > sort) {
            newList.push({
                updateMany: {
                    filter: { _id: item._id },
                    update: { sort: item.sort + 1 },
                },
            });
        }
    });

    return newList;
};
