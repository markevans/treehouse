import buildAdapter from './buildAdapter'
import { AdapterLookup, AdapterSpec } from './types'

type App = import('treehouse').App
type Plugin = import('treehouse').Plugin

const plugin: Plugin = (app: App) => {

  const adapters: AdapterLookup = {}

  const registerAdapter = <TProps>(
    name: string,
    spec: AdapterSpec<TProps>,
    component: any
  ) => adapters[name] = buildAdapter(
    name,
    spec,
    component,
    app,
    adapters,
  )

  return { adapters, registerAdapter }
}

export default plugin
