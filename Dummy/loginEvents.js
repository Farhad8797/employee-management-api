const { EventEmitter } = require("events");

const myEvent = new EventEmitter();

myEvent.on("start",(a,b) => {
    console.log(`Event started on ${a} and ${b}`);
});

myEvent.emit("start","First","Second");