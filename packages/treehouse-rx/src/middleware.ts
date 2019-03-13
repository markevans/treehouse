type Middleware = import('treehouse').Middleware
import { Stream } from './types'

type Options = {
  getStream: (name: string) => Stream,
  isStreamSubscribedTo: (name: string) => boolean
}

const middleware: Middleware = (next, app, { getStream, isStreamSubscribedTo } : Options) =>
  (eventName, payload, spec) => {
    const stream = getStream(eventName)
    if (stream) {
      stream.next([eventName, payload, app.getState(eventName, payload)])
    }
    if (!isStreamSubscribedTo(eventName)) {
      return next(eventName, payload)
    } else {
      return null
    }
  }

export default middleware
