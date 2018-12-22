export default (
  eventName,
  payload,
  {
    state,
    action,
    update,
  },
  app
) => {
  let dbView, currentState, actionReturnValue, changes
  if (state && (action || update)) {
    dbView = app.dbView(state, payload)
    currentState = dbView.pull()
  }
  if (action) {
    actionReturnValue = action(payload, app.dispatch, currentState)
  }
  if (update) {
    if (!state) {
      throw new Error(`'update' needs the state to be specified`)
    }
    dbView.push(update(currentState, payload))
    changes = app.commitUpdates()
  }
  return {
    changes,
    actionReturnValue,
  }
}
