import eventEmitter from "./index.mjs"

let my_obj = {}
const emitter = eventEmitter(["message", "request"])

const dispatch = emitter.install(my_obj)

emitter.setOnEventHandlerAddedHandler((event_name, handler) => {
	console.log("event handler added for", event_name, handler)
})

emitter.setOnEventDispatchedHandler((event_name, event_data) => {
	console.log("event dispatched", event_name, "with data", event_data)
})

emitter.setOnEventHandlerRemovedHandler((event_name, handler) => {
	console.log("event handler removed for", event_name, handler)
})

function a(...args) {
	console.log("event handler a", args)
}

function b(...args) {
	console.log("event handler b", args)
}

my_obj.on("message", b)
my_obj.on("message", a)

my_obj.removeEventListener("message", a)

my_obj.on("message", a)

console.log(my_obj)

dispatch("message", 1, 2, 3)
