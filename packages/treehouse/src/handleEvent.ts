import App from './App'
import { DbChange, EventName, EventPayload, EventSpec } from './types'

export default (
  eventName: EventName,
  payload: EventPayload,
  {
    state,
    action,
    update,
  }: EventSpec,
  app: App
) : {
  changes?: DbChange[],
  actionReturnValue: any
} => {
  let dbView, currentState, actionReturnValue, changes
  if (state && (action || update)) {
    dbView = app.dbView(state, payload)
    currentState = dbView.pull()
  }
  if (action) {
    if (!currentState) {
      throw new Error(`'action' needs the state to be specified`)
    }
    actionReturnValue = action(payload, app.dispatch, currentState)
  }
  if (update) {
    if (!dbView || !currentState) {
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
