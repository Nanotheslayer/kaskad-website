import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

/** Форматирование даты в русской локали (шаблоны date-fns) */
export const fmt = (date: Date | string | number, pattern: string) => format(new Date(date), pattern, { locale: ru })

/** Склонение: 1 коммуникация, 2 коммуникации, 5 коммуникаций */
function plural(n: number, forms: [one: string, few: string, many: string]): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return forms[0]
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return forms[1]
  return forms[2]
}

const commForms: [string, string, string] = ['коммуникация', 'коммуникации', 'коммуникаций']

export const pluralCommWord = (n: number) => plural(n, commForms)
export const pluralComm = (n: number) => `${n} ${pluralCommWord(n)}`
export const pluralDays = (n: number) => `${n} ${plural(n, ['день', 'дня', 'дней'])}`

/** Дата из <input type="date"> → ISO-строка на полдень, чтобы часовой пояс не сдвигал день */
export const dateInputToIso = (value: string) => new Date(`${value}T12:00:00`).toISOString()
