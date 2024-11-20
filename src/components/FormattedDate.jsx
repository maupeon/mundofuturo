const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function FormattedDate({ date, ...props }) {
  return (
    <time dateTime={date.toISOString()} {...props}>
      {dateFormatter.format(date)}
    </time>
  )
}
