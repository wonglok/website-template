export class MiniEngine {
  constructor ({ name }) {
    this.name = name
    this.debug = false
    let isAborted = false
    this.tasks = []
    this.resizeTasks = []
    this.cleanTasks = []
    this.onLoop = (fnc) => {
      this.tasks.push(fnc)
    }

    this.onResize = (fnc) => {
      fnc()
      this.resizeTasks.push(fnc)
    }

    this.onClean = (func) => {
      this.cleanTasks.push(func)
    }

    let intv = 0
    let internalResize = () => {
      clearTimeout(intv)
      intv = setTimeout(() => {
        this.resizeTasks.forEach(e => e())
      }, 16.8888 * 10.)
    }

    window.addEventListener('resize', () => {
      internalResize()
    })

    this.doCleanUp = () => {
      try {
        this.cleanTasks.forEach(e => e())
      } catch (e) {
        console.error(e)
      }
      isAborted = true
    }

    let isPaused = false
    this.toggle = () => {
      isPaused = !isPaused
    }
    this.pause = () => {
      isPaused = true
    }
    this.play = () => {
      isPaused = false
    }

    this.doMyWork = () => {
      if (isAborted) {
        return {
          name: this.name,
          duration: 0
        }
      }
      if (isPaused) {
        return {
          name: this.name,
          duration: 0
        }
      }

      let start = window.performance.now()
      try {
        this.tasks.forEach(e => e())
      } catch (e) {
        console.error(e)
      }
      let end = window.performance.now()
      let duration = end - start

      return {
        name: this.name,
        duration
      }
    }
  }
}
