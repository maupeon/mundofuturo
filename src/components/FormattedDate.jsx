const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function FormattedDate({ date, ...props }) {
  // Adjust the date to be one day ahead
  const adjustedDate = new Date(date)

  return (
    <time dateTime={adjustedDate.toISOString()} {...props}>
      {dateFormatter.format(adjustedDate)}
    </time>
  )
}
