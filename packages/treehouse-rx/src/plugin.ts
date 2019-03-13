import middleware from './middleware'
import Streams from './Streams'
import { EventSpecWithStreams } from './types'
type Plugin = import('treehouse').Plugin

const plugin: Plugin = app => {
  const streams = new Streams()

  const nextLayerDispatch = app.useMiddleware(middleware, {
    getStream: streams.getStream,
    isStreamSubscribedTo: (eventName: string) => !!streams.getSubscription(eventName)
  })

  app.onRegisterEvent((name: string, spec: EventSpecWithStreams) => {
    if (spec.stream) {
      streams.subscribeToStream(
        name,
        spec.stream,
        spec.injectStreams,
        ([e, p]) => nextLayerDispatch(e, p)
      )
    }
  })
}

export default plugin
