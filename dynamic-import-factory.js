const keyMaster = require('key-master')

module.exports = makeXhr => {
	const getters = {
		json: makeXhr(),
		iife: makeXhr({ parse: parseIife }),
	}

	const getterResponses = keyMaster(type => keyMaster(path => getters[type](path)))

	return (path, options) => {
		const { type } = Object.assign({ type: 'iife' }, options)

		if (!getters[type]) {
			throw new Error(`No getter for ${type}`)
		}

		return getterResponses.get(type).get(path).catch(e => {
			getterResponses.get(type).delete(path)
			throw e
		})
	}
}

const globalEval = eval
const iifeRegex = /^\s*(?:var|let|const) ?[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]+ ?= ?/
function parseIife(response) {
	return globalEval(response.responseText.replace(iifeRegex, ''))
}
