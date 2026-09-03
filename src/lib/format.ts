const TZ = 'Asia/Kathmandu'

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric', ...opts }).format(new Date(iso))

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso))

export const formatNPR = (n: number) => `NPR ${new Intl.NumberFormat('en-IN').format(n)}`
