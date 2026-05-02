import { RequestContext } from 'nestjs-request-context'

export class AppRequestContext extends RequestContext {
  constructor() {
    super({} as any, {} as any)
  }
  requestId: string = ''
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx = RequestContext.currentContext?.req as AppRequestContext | undefined
    return ctx || new AppRequestContext()
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext()
    if (ctx) {
      ctx.requestId = id
    }
  }

  static getRequestId(): string {
    return this.getContext()?.requestId || ''
  }
}
