type Middleware = import('treehouse').Middleware

const middleware: Middleware = next => (eventName, payload, spec) => {
  const shouldLog = !spec.tags || spec.tags.indexOf('nolog') === -1
  if (shouldLog) {
    console.groupCollapsed(`%cEVENT ${eventName}`, 'color: #070')
    console.log('%cPAYLOAD', 'color: #070; font-weight: bold', payload)
  }
  let ret
  try {
    ret = next(eventName, payload)
    if (shouldLog && ret.changes) {
      console.log('%cUPDATES', 'color: #770; font-weight: bold')
      ret.changes.forEach(({path, from, to}) =>
        console.log(`%c\tdb.${path.join('.')}`, 'font-weight: bold', from, '→', to)
      )
    }
  } finally {
    if (shouldLog) {
      console.groupEnd()
    }
  }
  return ret
}

export default middleware
