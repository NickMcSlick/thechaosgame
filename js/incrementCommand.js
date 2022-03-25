const createIncrementCommand = (counter) => {
    const previousCount = counter.count;

    return {
        execute() {
            counter.count += 1;
        },
        undo() {
            counter.count = previousCount;
        }
    }
}