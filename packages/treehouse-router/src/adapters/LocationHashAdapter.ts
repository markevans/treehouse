export default class LocationHashAdapter {

  listener: (() => void) | null = null

  watch (onChange: () => void) {
    this.listener = onChange
    window.addEventListener("hashchange", this.listener, false)
  }

  unwatch () {
    if (this.listener) {
      window.removeEventListener("hashchange", this.listener, false)
    }
    this.listener = null
  }

  pull (): string {
    var matches = window.location.href.match(/#(.*)$/)
    return matches ? (window as any).decodeURI(matches[1]) : ""
  }

  push (str: string) {
    window.location.hash = (window as any).encodeURI(str)
  }

}
