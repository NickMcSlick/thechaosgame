const pointCounter = createNamedCounter('Point');
console.log(pointCounter);

const pointCountManager = createCommandManager(pointCounter);

pointCountManager.doCommand(INCREMENT);
console.log(pointCounter);

pointCountManager.doCommand(INCREMENT);
console.log(pointCounter);

pointCountManager.doCommand(DECREMENT);
console.log(pointCounter);

pointCountManager.undo();
console.log(pointCounter);

pointCountManager.redo();
console.log(pointCounter);