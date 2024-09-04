export function formatDate(date: Date): string {
  const optionsDay: Intl.DateTimeFormatOptions = { day: '2-digit' }
  const optionsMonth: Intl.DateTimeFormatOptions = { month: '2-digit' }
  const optionsYear: Intl.DateTimeFormatOptions = { year: 'numeric' }

  const day = new Intl.DateTimeFormat('en-GB', optionsDay).format(date)
  const month = new Intl.DateTimeFormat('en-GB', optionsMonth).format(date).toUpperCase()
  const year = new Intl.DateTimeFormat('en-GB', optionsYear).format(date)

  return `${year}-${month}-${day}`
}

export default formatDate
