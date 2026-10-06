import type {
  Binding,
  ClassificationParams,
  Communication,
  CommunicationStatus,
  CommunicationTypeId,
  Confidentiality,
  SourceId,
  ThreeQuestions,
} from '../types/communication'
import { determineCascadeDepth, determineRequiredChannels } from '../utils/cascadeEngine'

/**
 * Демо-коммуникации. Даты заданы смещением от текущего дня, чтобы таймлайн
 * всегда выглядел «живым»: часть коммуникаций уже доведена, часть идёт, часть запланирована.
 */
const DAY = 24 * 60 * 60 * 1000
const today = new Date()
today.setHours(0, 0, 0, 0)

const at = (offsetDays: number, hour: number, minute = 0) =>
  new Date(today.getTime() + offsetDays * DAY + (hour * 60 + minute) * 60 * 1000).toISOString()

const none: ThreeQuestions = { q1: '', q2: '', q3: '' }

interface Seed {
  day: number
  hour: number
  type: CommunicationTypeId
  source: SourceId
  title: string
  essence: string
  key: string
  who: [name: string, directorate: string]
  cls: [ClassificationParams['impactScale'], ClassificationParams['urgency'], ClassificationParams['impactType'], ClassificationParams['tone']]
  /** Срок доведения — через сколько дней после создания */
  due: number
  conf?: Confidentiality
  binding?: Partial<Binding>
  q?: ThreeQuestions
  materials?: string[]
}

const seeds: Seed[] = [
  {
    day: -62, hour: 10, type: 'strategic', source: 'annual_conference',
    title: 'Стратегия «Петрович» на 2027–2029',
    essence: 'Представлены стратегические ориентиры на ближайшие три года: рост в основном бизнесе и выход в новые города-миллионники.',
    key: 'Мы растём в основном бизнесе и идём в новые города — каждый сотрудник влияет на этот результат.',
    who: ['Воронцов А.Н.', 'Генеральный директор'], cls: ['company', 'planned', 'values', 'emotional'], due: 14,
    binding: { foundation: ['people', 'service'], strategy: ['core', 'geography'], values: ['development'] },
    q: {
      q1: 'Утверждён трёхлетний план развития; затронут приоритет «Люди» и «Сервис».',
      q2: 'Ведёт к расширению географии и укреплению основного бизнеса.',
      q3: 'Для нас это шанс расти вместе с компанией — через ценность «Развитие».',
    },
    materials: ['Презентация стратегии.pptx'],
  },
  {
    day: -48, hour: 11, type: 'values', source: 'values_committee',
    title: 'Итоги Комитета по ценностям: герои квартала',
    essence: 'Комитет выбрал лучшие истории ценностного поведения. Рассказываем о героях и о том, что они сделали.',
    key: 'Ценности — это поступки конкретных людей рядом с нами.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 10,
    binding: { foundation: ['people'], values: ['people_first', 'overcoming'] },
  },
  {
    day: -41, hour: 9, type: 'documentation', source: 'monthly_meeting',
    title: 'Протокол ежемесячной встречи руководителей (август)',
    essence: 'Сводка решений встречи руководителей: ключевые кадровые решения, итоги месяца, планы.',
    key: 'Решения встречи зафиксированы — готовим сообщения для команд.',
    who: ['Исполнительный ассистент ГД', 'Администрация'], cls: ['company', 'planned', 'informing', 'official'], due: 3, conf: 'restricted',
  },
  {
    day: -35, hour: 14, type: 'directive', source: 'administration',
    title: 'Приказ об обновлении регламента отпусков',
    essence: 'С нового календарного года изменяется порядок согласования графика отпусков: заявки подаются через «Петлокал».',
    key: 'График отпусков теперь согласуется в «Петлокале» — без бумаги и подписей.',
    who: ['Сергеева Т.Н.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'action', 'official'], due: 7,
    binding: { foundation: ['it', 'people'] },
    materials: ['Приказ.pdf', 'Инструкция для руководителя.pdf'],
  },
  {
    day: -30, hour: 12, type: 'project', source: 'investment_committee',
    title: 'Открытие нового СТЦ в городе-миллионнике',
    essence: 'Принято решение об открытии нового СТЦ. Рассказываем о сроках, команде и вакансиях.',
    key: 'Мы открываем новый СТЦ — «Петрович» становится ближе к новым клиентам.',
    who: ['Директор по развитию', 'Дирекция по развитию'], cls: ['company', 'planned', 'values', 'emotional'], due: 7,
    binding: { foundation: ['service', 'cjm'], strategy: ['geography'], values: ['development'] },
  },
  {
    day: -27, hour: 10, type: 'reporting', source: 'monthly_meeting',
    title: 'Операционные итоги августа',
    essence: 'Выручка и ключевые операционные показатели за месяц, сравнение с планом.',
    key: 'Месяц закрыт выше плана — спасибо командам складов и СТЦ.',
    who: ['Финансовая дирекция', 'Финансовая дирекция'], cls: ['company', 'planned', 'informing', 'expert'], due: 5,
  },
  {
    day: -22, hour: 16, type: 'product', source: 'directorate',
    title: 'Новая категория: инструменты для загородного строительства',
    essence: 'В ассортименте появляется новая категория электро- и ручного инструмента. Рассказываем, кому и как её предлагать.',
    key: 'Расширяем ассортимент — клиенту стройки больше не нужно ехать за инструментом в другое место.',
    who: ['Коммерческая дирекция', 'Коммерческая дирекция'], cls: ['directorate', 'planned', 'informing', 'expert'], due: 7,
    binding: { foundation: ['service', 'cjm'], strategy: ['assortment', 'renovation'] },
  },
  {
    day: -19, hour: 9, type: 'hr_social', source: 'directorate',
    title: 'Корпоративный день здоровья',
    essence: 'Приглашаем сотрудников на день здоровья: вакцинация, спорт, консультации врачей.',
    key: 'Забота о здоровье — часть заботы о людях в «Петрович».',
    who: ['Белова Н.П.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'informal'], due: 6,
    binding: { foundation: ['people'], values: ['people_first'] },
  },
  {
    day: -16, hour: 11, type: 'explanatory', source: 'change_committee',
    title: 'Изменение схемы мотивации для менеджеров по продажам',
    essence: 'Пересматриваем коэффициенты премии. Объясняем, как изменится расчёт и что это значит для менеджеров.',
    key: 'Премия станет прозрачнее — вы сами сможете посчитать свой результат.',
    who: ['Виноградов П.Е.', 'Дирекция по персоналу'], cls: ['directorate', 'planned', 'action', 'expert'], due: 7,
    binding: { foundation: ['people'], strategy: ['core'] },
    q: {
      q1: 'Меняются коэффициенты премии менеджеров продаж; затрагивает приоритет «Люди».',
      q2: 'Поддерживает рост в основном бизнесе — «Сантехника», «Электрика».',
      q3: 'Для команды — понятные правила и предсказуемый доход; ценность «Человек в приоритете».',
    },
    materials: ['Схема расчёта.xlsx'],
  },
  {
    day: -14, hour: 13, type: 'strategic', source: 'live_broadcast',
    title: 'Прямой эфир с генеральным директором',
    essence: 'Генеральный директор отвечает на вопросы сотрудников о стратегии и планах на год.',
    key: 'Первые лица слышат вас — задавайте вопросы напрямую.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 3,
  },
  {
    day: -12, hour: 8, type: 'crisis', source: 'directorate',
    title: 'Сбой в работе складской системы: переход на ручной учёт',
    essence: 'Складская система недоступна. Приёмка и отгрузка временно ведутся по бумажным накладным.',
    key: 'Работаем по бумажным накладным, клиентов предупреждаем о возможной задержке.',
    who: ['Директор по IT', 'Дирекция по IT'], cls: ['company', 'crisis', 'action', 'restrained'], due: 0,
    binding: { foundation: ['it', 'service'], values: ['overcoming'] },
    q: {
      q1: 'Недоступна складская система; затронуты IT и сервис.',
      q2: 'Цель — сохранить наличие товара и скорость отгрузки.',
      q3: 'Команда работает по ручному учёту; ценность «Преодоление».',
    },
  },
  {
    day: -9, hour: 10, type: 'documentation', source: 'monthly_meeting',
    title: 'Протокол ежемесячной встречи руководителей (сентябрь)',
    essence: 'Сводка решений встречи руководителей: итоги месяца, планы, кадровые решения.',
    key: 'Решения встречи зафиксированы — готовим сообщения для команд.',
    who: ['Исполнительный ассистент ГД', 'Администрация'], cls: ['company', 'planned', 'informing', 'official'], due: 3, conf: 'restricted',
  },
  {
    day: -8, hour: 15, type: 'directive', source: 'administration',
    title: 'Назначение руководителя Корпоративного университета',
    essence: 'Приказом утверждён новый руководитель Корпоративного университета.',
    key: 'Корпоративный университет возглавил новый руководитель.',
    who: ['Макарова Е.В.', 'Дирекция по персоналу'], cls: ['directorate', 'planned', 'informing', 'official'], due: 2,
  },
  {
    day: -6, hour: 11, type: 'project', source: 'change_committee',
    title: 'Запуск портала каскадирования (пилот в ДП)',
    essence: 'Дирекция по персоналу первой начинает работать в модуле каскадирования: паспорт инфоповода и статус доведения.',
    key: 'Пилот каскадирования стартовал в ДП — мы тестируем, чтобы потом масштабировать.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['directorate', 'planned', 'action', 'expert'], due: 7,
    binding: { foundation: ['it', 'people'], values: ['development'] },
  },
  {
    day: -5, hour: 9, type: 'reporting', source: 'directorate',
    title: 'Результаты пульс-опроса за сентябрь',
    essence: 'Информированность растёт, понимание — в зоне внимания. Показываем результаты по дирекциям.',
    key: 'Мы слышим вас: вот что показал опрос и что мы с этим делаем.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'informing', 'expert'], due: 4,
    binding: { foundation: ['people'] },
  },
  {
    day: -4, hour: 12, type: 'hr_social', source: 'directorate',
    title: 'Старт опроса вовлечённости (октябрь)',
    essence: 'Опрос вовлечённости проходит три недели. Анонимно, 15 минут. Результаты расскажем всем.',
    key: 'Ваше мнение определяет, что мы улучшим в компании.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'action', 'informal'], due: 3,
    binding: { foundation: ['people'], values: ['people_first'] },
  },
  {
    day: -3, hour: 14, type: 'values', source: 'directorate',
    title: 'История ценностного поведения: водитель-партнёр спас поставку',
    essence: 'Партнёр-водитель не бросил груз при поломке и довёз товар клиенту вовремя.',
    key: 'Преодоление — когда доводишь дело до конца, даже если всё пошло не так.',
    who: ['Дирекция по логистике', 'Операционная дирекция'], cls: ['company', 'planned', 'values', 'emotional'], due: 5,
    binding: { foundation: ['service'], values: ['overcoming'] },
  },
  {
    day: -2, hour: 10, type: 'explanatory', source: 'directorate',
    title: 'Как работает новый пропуск в офис',
    essence: 'Переходим на электронные пропуска. Рассказываем, как получить, что делать при утере.',
    key: 'Пропуск оформляется один раз в «Петлокале» — дальше всё автоматически.',
    who: ['Дирекция по IT', 'Дирекция по IT'], cls: ['department', 'planned', 'action', 'official'], due: 6,
  },
  {
    day: -1, hour: 16, type: 'product', source: 'directorate',
    title: 'Новая программа лояльности для строителей',
    essence: 'Запуск расширенной программы лояльности: накопительные скидки и бонусы за объём.',
    key: 'Профессионалам стройки теперь выгоднее покупать в «Петрович».',
    who: ['Дирекция по маркетингу', 'Дирекция по маркетингу'], cls: ['company', 'planned', 'informing', 'informal'], due: 5,
    binding: { foundation: ['cjm', 'service'], strategy: ['core'] },
  },
  {
    day: 0, hour: 9, type: 'directive', source: 'administration',
    title: 'Приказ о графике выходных дней в ноябре',
    essence: 'Утверждён график выходных и праздничных дней на ноябрь.',
    key: 'График на ноябрь утверждён — проверьте свои смены.',
    who: ['Сергеева Т.Н.', 'Дирекция по персоналу'], cls: ['company', 'urgent', 'action', 'official'], due: 2,
    materials: ['Приказ.pdf'],
  },
  {
    day: 0, hour: 11, type: 'explanatory', source: 'change_committee',
    title: 'Новый порядок согласования командировок',
    essence: 'Командировки согласуются в «Петлокале» за 5 рабочих дней. Объясняем, что меняется для руководителей.',
    key: 'Согласование командировки — три клика в «Петлокале».',
    who: ['Тарасова О.В.', 'Дирекция по персоналу'], cls: ['directorate', 'planned', 'action', 'expert'], due: 5,
    binding: { foundation: ['it'] },
  },
  {
    day: 0, hour: 14, type: 'hr_social', source: 'directorate',
    title: 'Приглашение на день открытых дверей Корпоративного университета',
    essence: 'Расскажем о программах обучения и ответим на вопросы. Регистрация в «Петлокале».',
    key: 'Приходите узнать, как расти внутри компании.',
    who: ['Лаптев О.К.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'informal'], due: 7,
    binding: { foundation: ['people'], values: ['development'] },
  },
  {
    day: 1, hour: 9, type: 'crisis', source: 'directorate',
    title: 'Сильный снегопад: изменение графика доставки',
    essence: 'Из-за погодных условий возможны задержки доставки. Рекомендации для менеджеров и водителей.',
    key: 'Безопасность превыше сроков — клиентов предупреждаем заранее.',
    who: ['Операционная дирекция', 'Операционная дирекция'], cls: ['company', 'crisis', 'action', 'restrained'], due: 1,
    binding: { foundation: ['service'], values: ['people_first'] },
  },
  {
    day: 2, hour: 10, type: 'documentation', source: 'monthly_meeting',
    title: 'Сводка для каскадирования по итогам встречи руководителей',
    essence: 'Краткая сводка решений для подготовки сообщений командам.',
    key: 'Три решения встречи, которые нужно донести до команд на этой неделе.',
    who: ['Исполнительный ассистент ГД', 'Администрация'], cls: ['company', 'planned', 'informing', 'official'], due: 2, conf: 'restricted',
  },
  {
    day: 3, hour: 11, type: 'reporting', source: 'directorate',
    title: 'Промежуточные итоги опроса вовлечённости',
    essence: 'Первая неделя опроса: процент участия по дирекциям.',
    key: 'Участие выросло — осталось две недели, чтобы высказаться.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'informing', 'expert'], due: 3,
  },
  {
    day: 4, hour: 15, type: 'values', source: 'live_broadcast',
    title: 'Прямой эфир с директором по персоналу',
    essence: 'Разговор о развитии, обучении и карьерных треках. Вопросы можно задать заранее.',
    key: 'Развитие — это возможности, которые в компании уже есть.',
    who: ['Макарова Е.В.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 3,
    binding: { foundation: ['people'], values: ['development'] },
  },
  {
    day: 6, hour: 10, type: 'project', source: 'investment_committee',
    title: 'Выход в новый регион: набор команды',
    essence: 'Открываем набор в команду нового региона. Внутренний конкурс на переезд и наставничество.',
    key: 'Новый регион — карьерный шанс для сотрудников «Петрович».',
    who: ['Афанасьев К.Л.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 10,
    binding: { foundation: ['people'], strategy: ['geography'], values: ['development'] },
  },
  {
    day: 8, hour: 12, type: 'explanatory', source: 'directorate',
    title: 'Что меняется в льготах с 1 января',
    essence: 'Обновляем перечень льгот и порядок их получения. Рассказываем, кого это касается.',
    key: 'Льготы остаются — меняется только порядок оформления.',
    who: ['Виноградов П.Е.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'informing', 'expert'], due: 10,
    binding: { foundation: ['people'], values: ['people_first'] },
  },
  {
    day: 10, hour: 9, type: 'directive', source: 'administration',
    title: 'Приказ о проведении инвентаризации',
    essence: 'Сроки инвентаризации для складов и СТЦ, ответственные и порядок.',
    key: 'Инвентаризация проходит по графику — у каждого склада свои даты.',
    who: ['Операционная дирекция', 'Операционная дирекция'], cls: ['directorate', 'planned', 'action', 'official'], due: 5,
  },
  {
    day: 12, hour: 11, type: 'hr_social', source: 'directorate',
    title: 'Благотворительная акция «Тепло в каждый дом»',
    essence: 'Сбор вещей и средств для подшефных детских домов. Как принять участие и куда нести.',
    key: 'Помогать просто — и каждая малость важна.',
    who: ['Белова Н.П.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 14,
    binding: { foundation: ['people'], values: ['people_first'] },
  },
  {
    day: 15, hour: 10, type: 'documentation', source: 'monthly_meeting',
    title: 'Протокол ежемесячной встречи руководителей (октябрь)',
    essence: 'Сводка решений встречи руководителей за месяц.',
    key: 'Решения встречи зафиксированы — готовим сообщения для команд.',
    who: ['Исполнительный ассистент ГД', 'Администрация'], cls: ['company', 'planned', 'informing', 'official'], due: 3, conf: 'restricted',
  },
  {
    day: 19, hour: 14, type: 'product', source: 'directorate',
    title: 'Сезонный ассортимент: подготовка к зиме',
    essence: 'Расширяем зимний ассортимент: утеплители, отопление, снегоуборочная техника.',
    key: 'К зиме готовы — подскажите клиентам, что взять заранее.',
    who: ['Коммерческая дирекция', 'Коммерческая дирекция'], cls: ['company', 'planned', 'informing', 'informal'], due: 7,
    binding: { foundation: ['service'], strategy: ['assortment'] },
  },
  {
    day: 24, hour: 11, type: 'reporting', source: 'directorate',
    title: 'Итоги опроса вовлечённости (октябрь)',
    essence: 'Результаты опроса вовлечённости по дирекциям и план действий по зонам роста.',
    key: 'Вот что вы сказали — и вот что мы делаем.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'informing', 'expert'], due: 10,
    binding: { foundation: ['people'], values: ['people_first'] },
  },
  {
    day: 38, hour: 12, type: 'values', source: 'values_committee',
    title: 'Комитет по ценностям: итоги квартала',
    essence: 'Лучшие истории ценностного поведения четвёртого квартала.',
    key: 'Ценности живут в поступках — расскажем о тех, кто их проживает.',
    who: ['Зорина А.Д.', 'Дирекция по персоналу'], cls: ['company', 'planned', 'values', 'emotional'], due: 10,
    binding: { foundation: ['people'], values: ['people_first', 'development', 'overcoming'] },
  },
  {
    day: 61, hour: 10, type: 'strategic', source: 'annual_conference',
    title: 'Итоговая конференция года',
    essence: 'Подведение итогов года и планы на следующий год — для всех сотрудников.',
    key: 'Год — позади, и мы знаем, куда идём дальше.',
    who: ['Воронцов А.Н.', 'Генеральный директор'], cls: ['company', 'planned', 'values', 'emotional'], due: 14,
    binding: { foundation: ['people', 'service', 'it', 'cjm'], strategy: ['core', 'geography', 'assortment', 'renovation'], values: ['people_first', 'development', 'overcoming'] },
  },
]

function statusFor(createdAt: string, deadline: string): CommunicationStatus {
  const now = Date.now()
  if (new Date(createdAt).getTime() > now) return 'planned'
  if (new Date(deadline).getTime() < now) return 'completed'
  return 'active'
}

export const seedCommunications: Communication[] = seeds.map((s, i) => {
  const [impactScale, urgency, impactType, tone] = s.cls
  const classification: ClassificationParams = { impactScale, urgency, impactType, tone }
  const createdAt = at(s.day, s.hour)
  const deadline = at(s.day + s.due, s.hour)
  const confidentiality = s.conf ?? 'internal'
  const depth = determineCascadeDepth(s.type, classification)
  return {
    id: `seed-${i + 1}`,
    title: s.title,
    essence: s.essence,
    keyMessage: s.key,
    initiator: { name: s.who[0], directorate: s.who[1] },
    sourceId: s.source,
    typeId: s.type,
    classification,
    confidentiality,
    binding: { foundation: [], strategy: [], values: [], ...s.binding },
    questions: s.q ?? none,
    cascadeDepth: depth.depth,
    depthExtended: depth.extended,
    requiredChannels: determineRequiredChannels(s.type, confidentiality),
    extraChannels: [],
    materials: s.materials ?? [],
    createdAt,
    deadline,
    status: statusFor(createdAt, deadline),
  }
})
