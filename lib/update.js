module.exports = (app, spec, payload) => {
  const treeView = app.pick(spec.pick)
  const changes = spec.update(treeView.pull(), payload)
  treeView.push(changes)
  app.commitChanges()
}
