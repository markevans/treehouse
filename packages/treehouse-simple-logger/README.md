# Treehouse simple logger

Simple logger for Treehouse JS.

## Usage

Given a treehouse App, `app`:
```javascript
import loggerMiddleware from 'treehouse-simple-logger'

// ...

app.useMiddleware(loggerMiddleware)
```

This will display some useful info in the browser dev console when any event is dispatched.

To suppress logging of certain events, you can add the tag `'nolog'` to the event spec:

```javascript
  loadProducts: {

    tags: ['nolog'],

    // state, update, action, etc.
  }
```
