const loading = async () => {
    for await (const _i of new Array(100).fill(null).map((_, i) => i)) {
        await new Promise((resolve) => {
            setTimeout(() => {
                // Move cursor to left 1000 chars.
                process.stdout.write("\u001b[1000D" + (_i + 1) + "%");
                resolve();
            }, 100);
        });
    }
};

const a = {
    toString() {
        return "a";
    },
};

loading().then(() => {
    //
});
