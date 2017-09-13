require('tap-browser-color')()

const tape = require('tape')
const makeXhr = require('basic-xhr')

const makeImport = require('./dynamic-import-factory.js')

const makeDefaultImport = () => makeImport(makeXhr)

const test = (name, fn) => tape(name, t => {
	t.timeoutAfter(5000)
	fn(t).then(() => {
		t.end()
	}).catch(e => {
		t.error(e)
		t.end()
	})
})

test(`JSON`, t => {
	const load = makeDefaultImport()

	return load('./object.json', { type: 'json' }).then(result => {
		t.equal(typeof result, 'object')
		t.equal(result.success, true)
	})
})

test(`IIFE`, t => {
	const load = makeDefaultImport()

	return load('./iife.js', { type: 'iife' }).then(result => {
		t.equal(result, 'success')
	})
})

test(`Defaults to IIFE`, t => {
	const load = makeDefaultImport()

	return load('./iife.js').then(result => {
		t.equal(result, 'success')
	})
})

test(`Rejects when the file isn't there`, t => {
	const load = makeDefaultImport()

	return load('./zzzzzzzzzzz.json', { type: 'json' }).then(result => {
		t.fail(`Shouldn't succeed`)
	}).catch(e => {
		t.ok(e)
		t.pass('Rejected')
	})
})

test(`Can parse an iife without parens enclosing the function`, t => {
	const load = makeDefaultImport()

	return load('./iife-without-parens.js').then(result => {
		t.equal(result, 'success')
	})
})

test(`Can parse an iife without parens with a stupid semicolon`, t => {
	const load = makeDefaultImport()

	return load('./iife-without-parens-with-semi.js').then(result => {
		t.equal(result, 'success')
	})
})

test(`Only makes one request at a time for the same file`, t => {
	const calls = {
		a: 0,
		b: 0,
	}
	const load = makeImport(() => url => {
		calls[url] = calls[url] + 1

		return new Promise(resolve => {
			setTimeout(() => {
				resolve('correct ' + url)
			}, 500)
		})
	})

	return Promise.all([
		load('a'),
		load('a'),
		load('a'),
		load('b'),
	]).then(results => {
		t.equal(results[0], 'correct a')
		t.equal(results[1], 'correct a')
		t.equal(results[2], 'correct a')
		t.equal(results[3], 'correct b')

		t.equal(calls.a, 1)
		t.equal(calls.b, 1)
	})
})

test(`Cache different types separately`, t => {
	let calls = 0

	const load = makeImport(() => url => {
		calls++

		return Promise.resolve(calls)
	})

	return Promise.all([
		load('a', { type: 'iife' }),
		load('a', { type: 'json' }),
	]).then(([ iife, json ]) => {
		t.equal(iife, 1)
		t.equal(json, 2)
		t.equal(calls, 2)
	})
})

test(`Don't cache rejected results`, t => {
	let calls = 0
	const load = makeImport(() => url => {
		calls++
		if (calls == 1) {
			return Promise.reject({ borked: true })
		}

		return Promise.resolve('wheee')
	})

	return load('a').then(() => {
		t.fail('Should not succeed')
	}).catch(e => {
		t.ok(e.borked)

		return load('a').then(wheee => {
			t.equal(wheee, 'wheee')
		})
	})
})
