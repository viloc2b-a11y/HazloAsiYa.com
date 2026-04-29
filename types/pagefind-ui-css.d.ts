declare module '@pagefind/default-ui/css/ui.css'

declare module '@pagefind/default-ui' {
  export class PagefindUI {
    constructor(options: {
      element: string
      bundlePath?: string
      showSubResults?: boolean
      [key: string]: unknown
    })
    destroy?: () => void
    triggerSearch?: (query: string) => void
  }
}
