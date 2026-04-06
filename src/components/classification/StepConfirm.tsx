interface Props {
  title: string
  description: string
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
}

export default function StepConfirm({ title, description, onTitleChange, onDescriptionChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-brand-dark mb-1">Шаг 5: Подтверждение</h2>
      <p className="text-sm text-gray-500 mb-5">Опишите коммуникацию и отправьте на таймлайн</p>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Краткое описание коммуникации"
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Описание</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Подробное описание информации для каскадирования..."
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red resize-none"
          />
        </div>
      </div>
    </div>
  )
}
