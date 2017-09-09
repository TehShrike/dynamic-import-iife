Dynamically import [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) (and JSON) files in the browser.

For when you want to lazy-load some files, or do some really basic code splitting.

```js
const load = require('dynamic-import-iife')

load('/some-iife.js').then(usefulFunctionExportedByModule => {
	usefulFunctionExportedByModule() // cool!
})
```

# promise = load(url, [options])

- `url`: string
- `options`: object
	- `type`: string.  Either `'iife'` or `'json'`

The promise will reject if there is an error fetching or evaluating the file.

If the file is successfully evaluated, the result will be cached for future requests.

# License

[WTFPL](http://wtfpl2.com)
