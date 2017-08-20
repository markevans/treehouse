# Treehouse JS

[![Code Climate](https://codeclimate.com/github/markevans/treehouse/badges/gpa.svg)](https://codeclimate.com/github/markevans/treehouse)

[![Build Status](https://travis-ci.org/markevans/treehouse.svg?branch=master)](https://travis-ci.org/markevans/treehouse)

## Overview
Treehouse is an opinionated small javascript framework for writing single-page web apps.

Its main concern is *maintaining application state*, and organising business logic into *actions*, that modify the state.

For the view/template layer, you can use your preferred library.

The basic flow as as follows:

  - ALL the state about the system is kept in one immutable state tree.
    The tree should be normalized (no duplicated data) and JSON serializable, i.e. contains only objects, arrays, strings and numbers.

  - EVERY single input enters the system via an "action". An "input" means:
    - user interaction with the DOM, e.g. a click
    - a message from a websocket
    - a timer/interval callback
    - a URL update

  - An action updates the tree in some way. As the tree is immutable, the whole tree needs to be changed. Treehouse provides "cursor" objects to make this extremely easy.

## Usage with React
See [Treehouse-React](https://github.com/markevans/treehouse-react).

### The treehouse app
```javascript
const treehouse = require('treehouse')
```
Requiring treehouse returns a singleton treehouse app, which ties together all the other components.

### Initializing the state tree
```javascript
treehouse.init({
  currentUserId: 36,
  // Storing collections of objects keyed by ID is a REALLY GOOD IDEA!
  // Turning it into an array is super-easy with a "query" (see below)
  films: {
    id1: {title: "Inception", id: 'id1', rating: 86},
    id2: {title: "Dead Man's Shoes", id: 'id2', rating: 57},
    id3: {title: "Groundhog Day", id: 'id3', rating: 96}
  },
  modalIsOpen: false
})
```

### Cursors
Given that the tree should be immutable (which has great benefits when using with
libraries like React), if we wanted to update the rating of "Dead Man's Shoes" to 84,
then if we had a plain javascript object we'd need to update every branch up to the root,
which would look something like this:
```javascript
let newTree = Object.assign(
  {},
  currentTree,
  {
    films: Object.assign(
      {},
      currentTree.films,
      {
        id2: Object.assign(
          {},
          currentTree.films.id2,
          {
            rating: 84
          }
        )
      }
    )
  }
)
```
Yuk! Even with Javascript spread syntax it would be pretty bad, and what's more, error-prone.

Cursors hold a reference to the tree object internally, and update parent branches for us,
so instead we can just do
```javascript
  treehouse.at('films', 'id2', 'rating').set(84)  // .at(...) returns a Cursor object
```

We can also update using a "reducer" function, which should always return a new object
```javascript
  treehouse.at('films', 'id2', 'rating').update(rating => rating + 27)
```

Furthermore, because this will be used so often, `update` is aliased to `$`.

Treehouse provides a few reducer functions in `'treehouse/reducers'`,
and typically the user will wish to define their own.
Any extra args sent to `update`/`$` are passed to the reducer.

```javascript
  import { merge } from 'treehouse/reducers/Object'
  treehouse.at('films', 'id2').$(merge, {rating: 84})
```

Furthermore, you can register reducers using
```javascript
treehouse.registerReducers({
  append: (string, extra) => {
    return string + extra
  }

  //...
})
```
and then use by name
```javascript
treehouse.at('films', 'id2', 'title').$('append', ": The Movie")
```

To get the raw data at cursor, use `get`
```javascript
  treehouse.at('films', 'id2', 'rating').get()  // 84
```


### Actions
As described above, _every_ single input that might change the state should enter the system via an "action".

Each action's main job is to update the state tree. Each registered function takes
the state tree, and a single payload argument.

First register actions
```javascript
treehouse.registerActions({

  updateRating (tree, {filmId, rating}) => {
    tree.at('items', filmId, 'rating').set(rating)
  },

  //...

})
```

To call the action, we build it with
```javascript
let action = treehouse.action('updateRating')
```
and call it when we need to
```javascript
action({filmId: 'id2', rating: 84})
```

Alternatively, we can pass the payload in when building (effectively currying the payload argument)
```javascript
let action = treehouse.action('updateRating', {filmId: 'id2', rating: 84})
```
and call it with
```javascript
action()
```

This works particularly well with libraries like React, where we can do things like
```jsx
<a onClick={treehouse.action('updateRating', {filmId, rating: this.state.rating})}>Update Rating</a>
```

### Asynchronous actions
If you change the tree asynchronously in an action, you should call another action once the asynchronous event has happened.
A third argument is provided for this
```javascript
treehouse.registerActions({

  getUsersFromServer: (tree, {filmId}, action) => {
    server.getRating(filmId).then((rating) => {
      action('updateRating')({filmId, rating})
    })
  }

  //...
})
```


### Queries
Queries query the tree and return data. They are automatically cached,
and only change when any parts of the tree it cares about are changed.

```javascript
treehouse.registerQueries({

  filmsByName: {
    deps: (t) => { // Declare dependencies
      return {
        films: t.at('films')
      }
    },
    get: ({films}) => {
      return Object.values(films).sort((a, b) => {
        return a.title < b.title
      })
    }
  }

})
```

Once registered, they can be accessed with
```javascript
treehouse.query('filmsByName')
```
The actual data can be accessed with `get`
```javascript
treehouse.query('filmsByName').get() // [{id: "id2", ...}, ...]
```

Any arguments are passed as a second argument to the registered `get` function
```javascript
treehouse.registerQueries({

  bestFilms: {
    deps: (t) => {
      return {
        films: t.at('films')
      }
    },
    get: ({films}, {minRating}) => {
      let bestFilms = [], id
      for (id in films) {
        if(films[id].rating >= minRating) bestFilms.push(films[id])
      }
      return bestFilms
    }
  }

})

let query = treehouse.query('bestFilms', {minRating: 90})
```

### Filters

Cursors, e.g. `treehouse.at('some', 'path')`
and queries, e.g. `treehouse.query('someQuery', {some: 'args'})`
can be streamed through a filter, e.g.
```javascript
  treehouse.at('some', 'path').filter('orderBy', {key: 'date'})
```

Registering one is very easy - just give a function that takes data and
returns the filtered data, e.g.

```javascript
treehouse.registerFilters({

  orderBy: (array, args) => {
    //...return new ordered array
  }

  //...
})
```

## TreeViews
Create a "TreeView" by selecting the items you care about
```javascript
let treeView = treehouse.pick((t) => {
  return {
    messages: t.at('path', 'to', 'messages').filter('latest'),
    unread: t.query('numUnreadMessages')
  }
})
```

Get data
```javascript
treeView.get()   // {
                 //   messages: [...],
                 //   unread: 7462964
                 // }
```

To watch for data changes at any of the specified paths
```javascript
treeView.watch((t) => { // (the callback yields the treeView itself)
  // ...
})
```

To unwatch
```javascript
treeView.unwatch()
```

## Setting through filters, queries and treeViews
Given a cursor `treehouse.at('selectedUserID')` we can both `get()` and `set(value)`.

But what about something that's been filtered,
e.g. `treehouse.at('users').filter('objectToArray')`,
or a query, e.g. `treehouse.query('selectedUserName')`?

Treehouse doesn't let you set through filters, queries and treeViews, because you're encouraged to update any
state within actions, using just cursors onto the tree.

However, you can retrieve a list of changes that need to happen by "putting back" values through filters or queries (or cursors).

### Putting values back through cursors
This simply returns the changes that need to happen, e.g.
```javascript
  let changes = treehouse.at('some', 'path').putBack(4)
  changes // [{path: ['some', 'path'], value: 4}]
```

### Putting values back through filters
If a filter can be defined two-way, e.g. to filter between
```javascript
"some words"  <------>  "SOME WORDS"
```
then we can register both a forward and reverse filter function
```javascript
treehouse.registerFilters({
  upcase: {
    forward: (string) => {
      return string.toUpperCase()
    },
    reverse: (string) => {
      return string.toLowerCase()
    }
  }
})
```
Then putting back through the filter calls the reverse function on the way through.
```javascript
let stream = treehouse.at('words').filter('upcase')
let changes = stream.putBack('NEW WORDS')
changes // [{path: ['words'], value: 'new words'}]
```

### Setting through queries
We can add a `change` option to the query declaration, which should return an object with changes to be made
```javascript
treehouse.registerQueries({
  selectedUserName: {
    deps (t) {
      return {
        users: t.at('userList'),
        id: t.at('selectedUserID')
      }
    },
    get ({users, id}) {
      return users[id].name
    },
    change (name, {users}) {
      let user = users.find(user => user.name == name)
      return {
        id: user.id  // Keys should match with keys from the deps, and value is the new value it should be set to
      }
    }
  }
})
```
Then we get changes to be made with
```javascript
let changes = treehouse.query('selectedUserName').putBack('Robinson Crusoe')
changes //  [{path: ['selectedUserID'], value: 63}]
```

### Setting through a treeView
A treeview simply collates the changes made from each item
```javascript
let treeView = treehouse.pick((t) => {
  return {
    thing: t.at('some', 'path'),
    latestUsers: t.at('users').filter('latest'),
    runners: t.query('fastestRunners')
  }
})

let changes = treeView.putBack({
  thing: ...,
  latestUsers: ...,
  runners: ...
})

changes  // [
              { path: [....], value: ... },
              ...
            ]
```
Obviously this only works if each item is defined correctly as two-way, as above.

### Applying changes
We can apply changes to any cursor with `apply`
```javascript
tree.apply(changes)  // tree here is a cursor, like the one yielded in actions
```
Building up changes like this is how the [Treehouse Router](https://github.com/markevans/treehouse-router) works.
It collects changes to be made when a url is changed, then this list of changes can be passed directly into the "url changed" action, and changes applied accordingly.
