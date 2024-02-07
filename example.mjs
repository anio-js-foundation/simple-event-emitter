import eventEmitter from "./index.mjs"

let my_obj = {}
const emitter = eventEmitter(["message", "request"])

const dispatch = emitter.install(my_obj)

function a(args) {
	console.log("a", args)
}

function b(args) {
	console.log("b", args)
}

my_obj.on("message", b)
my_obj.on("message", a)

my_obj.removeEventListener(a)

my_obj.on("message", a)

console.log(my_obj)

dispatch("message", 1)
