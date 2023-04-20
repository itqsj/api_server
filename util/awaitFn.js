exports.awaitFn = async (asyncFn) => {
    return new Promise((resolve) => {
        asyncFn.then(
            (res) => {
                resolve({ res, success: true });
            },
            (err) => {
                resolve({ err, success: false });
            },
        );
    });
};
