export default function eventEmitter(valid_events) {
	let methods = {}
	let registered_handler = {}

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

	methods.on = function on(event_name, fn) {
		return methods.addEventListener(event_name, fn)
	}

	methods.addEventListener = function addEventListener(event_name, fn) {
		if (!(event_name in registered_handler)) {
			throw new Error(`Invalid event '${event_name}'.`)
		} else if (findPreviouslyInstalledEventHandler(fn) !== null) {
			throw new Error(`This function was already registered as an event handler.`)
		}

		registered_handler[event_name].push(fn)
	}

	methods.removeEventListener = function removeEventListener(fn) {
		let target_event_name = findPreviouslyInstalledEventHandler(fn)

		if (target_event_name === null) {
			throw new Error(`Trying to remove an event handler that does not exist.`)
		}

		registered_handler[target_event_name] = registered_handler[target_event_name].filter(handler => {
			return !Object.is(handler, fn)
		})
	}

	return {
		install(obj) {
			for (const method of ["on", "addEventListener", "removeEventListener"]) {
				obj[method] = methods[method]
			}

			return function dispatchEvent(event_name, event_data) {
				if (!(event_name in registered_handler)) {
					throw new Error(`Invalid event '${event_name}'.`)
				}

				for (const handler of registered_handler[event_name]) {
					handler(event_data)
				}
			}
		}
	}
}