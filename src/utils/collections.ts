/**
 * Поиск по id для справочников, где id — union-тип. На неизвестный id бросает ошибку: из кода такой id
 * не пропустит TypeScript, а данные из localStorage проверяются при загрузке (store/persistedState.ts),
 * поэтому вызывающему коду не нужны проверки на undefined.
 */
export function indexById<K extends string, T extends { id: K }>(items: readonly T[]): (id: K) => T {
  const map = new Map(items.map((item) => [item.id, item]))
  return (id) => {
    const item = map.get(id)
    if (!item) throw new Error(`Неизвестный id справочника: ${id}`)
    return item
  }
}

/** Добавляет элемент в список или убирает его, если он уже есть */
export function toggleItem<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
}

/** То же для Set: возвращает новый Set, исходный не меняется */
export function toggleInSet<T>(set: ReadonlySet<T>, item: T): Set<T> {
  const next = new Set(set)
  if (next.has(item)) next.delete(item)
  else next.add(item)
  return next
}
