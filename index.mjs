export default function eventEmitter(valid_events) {
	let methods = {}
	let registered_handler = {}
	let event_handler_added_handler = null
	let event_handler_removed_handler = null

	for (let event of valid_events) {
		registered_handler[event] = []
	}

	const findPreviouslyInstalledEventHandler = (fn) => {
		let target_event_name = null

		for (const event in registered_handler) {
			for (const handler of registered_handler[event]) {
				if (Object.is(handler, fn)) {
					target_event_name = event

					break
				}
			}
		}

		return target_event_name
	}

	const handlerInstalledForEvent = (event_name, fn) => {
		return registered_handler[event_name].filter(handler => {
			return Object.is(handler, fn)
		}).length > 0
	}

	methods.on = function on(event_name, fn) {
		return methods.addEventListener(event_name, fn)
	}

	methods.addEventListener = function addEventListener(event_name, fn) {
		if (!(event_name in registered_handler)) {
			throw new Error(`Invalid event '${event_name}'.`)
		} else if (handlerInstalledForEvent(event_name, fn)) {
			throw new Error(`This *exact* function was already registered for this event.`)
		}

		registered_handler[event_name].push(fn)

		if (typeof event_handler_added_handler === "function") {
			event_handler_added_handler(event_name, fn)
		}
	}

	methods.removeEventListener = function removeEventListener(event_name, fn) {
		if (!(event_name in registered_handler)) {
			throw new Error(`Invalid event '${event_name}'.`)
		} else if (!handlerInstalledForEvent(event_name, fn)) {
			throw new Error(`This function was not registered for this event.`)
		}

		registered_handler[event_name] = registered_handler[event_name].filter(handler => {
			return !Object.is(handler, fn)
		})

		if (typeof event_handler_removed_handler === "function") {
			event_handler_removed_handler(event_name, fn)
		}
	}

	return {
		setOnEventHandlerAddedHandler(fn) {
			event_handler_added_handler = fn
		},

		setOnEventHandlerRemovedHandler(fn) {
			event_handler_removed_handler = fn
		},

		install(obj) {
			for (const method of ["on", "addEventListener", "removeEventListener"]) {
				obj[method] = methods[method]
			}

			return function dispatchEvent(event_name, ...event_data) {
				if (!(event_name in registered_handler)) {
					throw new Error(`Invalid event '${event_name}'.`)
				}

				for (const handler of registered_handler[event_name]) {
					setTimeout(handler, 0, ...event_data)
				}
			}
		}
	}
}
