import type { OrgNode } from '../types/organization'

/**
 * ПИЛОТ: реальная структура Дирекции по персоналу (по данным раздела «Структура компании» на «Петлокале»).
 * Названия подразделений — реальные. ФИО руководителей и численность — условные (демо-данные).
 *
 * Правило отнесения к уровням (п. 4 Положения):
 *   У.01 — генеральный директор
 *   У.02 — директор дирекции
 *   У.03 — руководители, подчинённые напрямую директору дирекции (центры экспертизы, отделы)
 *   У.04 — руководители отделов, направлений и групп внутри центров
 *   У.05 — ведущие менеджеры и старшие специалисты
 *   У.06 — специалисты и младшие специалисты
 */
interface UnitSpec {
  id: string
  title: string
  position: string
  name: string
  /** Ведущие менеджеры и старшие специалисты (У.05) */
  s5?: number
  /** Специалисты и младшие специалисты (У.06) */
  s6?: number
  note?: string
  children?: UnitSpec[]
}

const gd = { name: 'Воронцов А.Н.' }
const director = { name: 'Макарова Е.В.' }

const centers: UnitSpec[] = [
  {
    id: 'hr_dept',
    title: 'Отдел персонала',
    position: 'Руководитель отдела',
    name: 'Сергеева Т.Н.',
    s5: 3,
    s6: 9,
  },
  {
    id: 'culture_dept',
    title: 'Отдел по корпоративной культуре и социальной ответственности',
    position: 'Руководитель отдела',
    name: 'Белова Н.П.',
    s5: 2,
    s6: 5,
  },
  {
    id: 'crkk',
    title: 'Центр развития корпоративной культуры и бренда работодателя',
    position: 'Руководитель центра',
    name: 'Зорина А.Д.',
    s5: 3,
    s6: 4,
    note: 'В команде — ведущий менеджер по корпоративным коммуникациям: методологическая поддержка каскадирования, пульс-опросы, контент для каналов (п. 1.3 Положения)',
  },
  {
    id: 'analytics_center',
    title: 'Центр экспертизы аналитики и автоматизации HR бизнес-процессов',
    position: 'Руководитель центра экспертизы',
    name: 'Ковалёв Д.И.',
    children: [
      {
        id: 'bp_analytics',
        title: 'Направление аналитики бизнес-процессов',
        position: 'Руководитель направления',
        name: 'Фомин Р.А.',
        s5: 2,
        s6: 4,
      },
      {
        id: 'data_analytics',
        title: 'Направление аналитики данных',
        position: 'Руководитель направления',
        name: 'Исаева К.С.',
        s5: 2,
        s6: 5,
      },
    ],
  },
  {
    id: 'admin_center',
    title: 'Центр экспертизы кадрового администрирования и сервиса',
    position: 'Руководитель центра экспертизы',
    name: 'Тарасова О.В.',
    children: [
      {
        id: 'military_desk',
        title: 'Военно-учётный стол',
        position: 'Руководитель стола',
        name: 'Горбунов В.М.',
        s5: 1,
        s6: 3,
      },
      {
        id: 'kais',
        title: 'Группа кадрового администрирования и сервиса',
        position: 'Руководитель группы',
        name: 'Андреева Л.Ю.',
        s5: 3,
        s6: 12,
      },
      {
        id: 'kais_batetskaya',
        title: 'Группа кадрового администрирования и сервиса ОП Батецкая',
        position: 'Руководитель группы',
        name: 'Мельников С.П.',
        s5: 1,
        s6: 6,
      },
      {
        id: 'kais_ufo',
        title: 'Группа кадрового администрирования и сервиса УФО',
        position: 'Руководитель группы',
        name: 'Крылова Ю.А.',
        s5: 2,
        s6: 8,
      },
      {
        id: 'kais_cfo',
        title: 'Группа кадрового администрирования и сервиса ЦФО',
        position: 'Руководитель группы',
        name: 'Соловьёв И.Г.',
        s5: 2,
        s6: 9,
      },
    ],
  },
  {
    id: 'comp_center',
    title: 'Центр экспертизы компенсаций и льгот',
    position: 'Руководитель центра экспертизы',
    name: 'Виноградов П.Е.',
    children: [
      {
        id: 'data_group',
        title: 'Группа аналитики и управления данными',
        position: 'Руководитель группы',
        name: 'Щербакова М.Л.',
        s5: 2,
        s6: 4,
      },
      {
        id: 'budget_group',
        title: 'Группа бюджетирования расходов на персонал и разработки систем мотивации',
        position: 'Руководитель группы',
        name: 'Назарова Е.О.',
        s5: 2,
        s6: 3,
      },
      {
        id: 'benefits_group',
        title: 'Группа льгот, мотивации и расчёта премиальных выплат',
        position: 'Руководитель группы',
        name: 'Давыдов А.Т.',
        s5: 2,
        s6: 7,
      },
    ],
  },
  {
    id: 'edu_center',
    title: 'Центр экспертизы образовательной системы',
    position: 'Руководитель центра экспертизы',
    name: 'Суворова И.А.',
    children: [
      {
        id: 'edu_admin',
        title: 'Администрация центра экспертизы образовательной системы',
        position: 'Руководитель администрации',
        name: 'Кириллова В.Н.',
        s5: 1,
        s6: 3,
      },
      {
        id: 'methodology',
        title: 'Группа методологии и бизнес-тренинга',
        position: 'Руководитель группы',
        name: 'Ермаков Н.С.',
        s5: 3,
        s6: 6,
      },
      {
        id: 'kc_training',
        title: 'Группа обучения и развития персонала КЦ',
        position: 'Руководитель группы',
        name: 'Полякова Д.М.',
        s5: 3,
        s6: 10,
      },
      {
        id: 'training_partners',
        title: 'Группа партнёрства по обучению',
        position: 'Руководитель группы',
        name: 'Гусева Т.Р.',
        s5: 1,
        s6: 4,
      },
      {
        id: 'corp_university',
        title: 'Корпоративный университет',
        position: 'Руководитель университета',
        name: 'Лаптев О.К.',
        s5: 3,
        s6: 8,
      },
    ],
  },
  {
    id: 'assessment_center',
    title: 'Центр экспертизы оценки и развития персонала',
    position: 'Руководитель центра экспертизы',
    name: 'Борисова Л.Е.',
    children: [
      {
        id: 'assessment_admin',
        title: 'Администрация центра экспертизы оценки и развития персонала',
        position: 'Руководитель администрации',
        name: 'Лукин А.В.',
        s5: 1,
        s6: 3,
      },
      {
        id: 'ld_automation',
        title: 'Группа по автоматизации процессов обучения и развития',
        position: 'Руководитель группы',
        name: 'Одинцов Г.Д.',
        s5: 2,
        s6: 4,
      },
      {
        id: 'talent_pool',
        title: 'Группа развития кадрового резерва',
        position: 'Руководитель группы',
        name: 'Симонова А.П.',
        s5: 2,
        s6: 5,
      },
      {
        id: 'training_center',
        title: 'Учебный центр',
        position: 'Руководитель учебного центра',
        name: 'Родионов М.Ю.',
        s5: 3,
        s6: 9,
      },
    ],
  },
  {
    id: 'recruit_center',
    title: 'Центр экспертизы подбора персонала',
    position: 'Руководитель центра экспертизы',
    name: 'Афанасьев К.Л.',
    children: [
      {
        id: 'recruit_kc',
        title: 'Отдел подбора персонала контакт-центра',
        position: 'Руководитель отдела',
        name: 'Чернова Н.И.',
        s5: 3,
        s6: 14,
      },
      {
        id: 'recruit_retail',
        title: 'Отдел подбора персонала розничной сети',
        position: 'Руководитель отдела',
        name: 'Юдин В.С.',
        s5: 4,
        s6: 18,
        note: 'В «Петлокале» у отдела есть вложенные подразделения — в пилот они пока не вошли',
      },
      {
        id: 'recruit_co',
        title: 'Отдел подбора персонала центрального офиса',
        position: 'Руководитель отдела',
        name: 'Широкова О.А.',
        s5: 2,
        s6: 7,
      },
    ],
  },
]

/** Корень дерева — генеральный директор */
export const ORG_ROOT_ID = 'gd'
/** Пилотная дирекция — Дирекция по персоналу */
export const PILOT_ID = 'dp'

const unitNodes: OrgNode[] = []

/**
 * Разворачивает описание подразделения в узлы дерева: руководитель (unit), вложенные подразделения
 * и команды У.05 / У.06 (team). Команда У.06 вкладывается в У.05, если есть обе.
 * Возвращает численность подразделения вместе с вложенными, включая руководителя.
 */
function addUnit(spec: UnitSpec, level: 'У03' | 'У04'): number {
  const unit: OrgNode = {
    id: spec.id,
    level,
    kind: 'unit',
    title: spec.title,
    position: spec.position,
    name: spec.name,
    children: [],
    note: spec.note,
  }
  unitNodes.push(unit)

  let total = 1 + (spec.s5 ?? 0) + (spec.s6 ?? 0)
  for (const child of spec.children ?? []) {
    unit.children.push(child.id)
    total += addUnit(child, 'У04')
  }

  const seniorsId = `${spec.id}__u05`
  const specialistsId = `${spec.id}__u06`
  if (spec.s5) {
    unit.children.push(seniorsId)
    unitNodes.push({
      id: seniorsId,
      level: 'У05',
      kind: 'team',
      title: 'Ведущие менеджеры и старшие специалисты',
      headcount: spec.s5,
      children: spec.s6 ? [specialistsId] : [],
    })
  }
  if (spec.s6) {
    if (!spec.s5) unit.children.push(specialistsId)
    unitNodes.push({
      id: specialistsId,
      level: 'У06',
      kind: 'team',
      title: 'Специалисты и младшие специалисты',
      headcount: spec.s6,
      children: [],
    })
  }

  unit.headcount = total
  return total
}

// Директор дирекции + все подразделения центров
const pilotHeadcount = 1 + centers.reduce((sum, c) => sum + addUnit(c, 'У03'), 0)

export const orgNodes: OrgNode[] = [
  {
    id: ORG_ROOT_ID,
    level: 'У01',
    kind: 'root',
    title: 'Генеральный директор',
    position: 'Генеральный директор ООО «СТД «Петрович»',
    name: gd.name,
    children: [PILOT_ID, 'other_directions'],
  },
  {
    id: 'other_directions',
    level: 'У02',
    kind: 'root',
    title: 'Другие дирекции и дивизионы',
    note: 'ДО, ДК, ДМ, ДР, ДЮ, ДФ, ДИТ, управление розничных продаж, маркетплейс, СЗФО, ЦФО, УФО — вне пилота',
    children: [],
  },
  {
    id: PILOT_ID,
    level: 'У02',
    kind: 'unit',
    title: 'Дирекция по персоналу',
    position: 'Директор по персоналу (ДП)',
    name: director.name,
    headcount: pilotHeadcount,
    children: centers.map((c) => c.id),
  },
  ...unitNodes,
]

export const orgById = new Map(orgNodes.map((n) => [n.id, n]))
