import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { addDays, format } from 'date-fns'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import Stepper from '../components/common/Stepper'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import StepSource from '../components/classification/StepSource'
import StepType from '../components/classification/StepType'
import StepClassification from '../components/classification/StepClassification'
import StepPassport from '../components/classification/StepPassport'
import StepDeadline from '../components/classification/StepDeadline'
import StepResult from '../components/classification/StepResult'
import DepthScale from '../components/communication/DepthScale'
import { determineCascadeDepth, determineRequiredChannels } from '../utils/cascadeEngine'
import { useCommunicationsStore } from '../store/communicationsStore'
import { typeById } from '../data/communicationTypes'
import { levelById } from '../data/levels'
import type { ChannelId } from '../types/channel'
import type {
  Binding,
  ClassificationParams,
  CommunicationTypeId,
  Confidentiality,
  SourceId,
  ThreeQuestions,
} from '../types/communication'

const steps = [
  { label: 'Площадка' },
  { label: 'Тип' },
  { label: 'Классификация' },
  { label: 'Суть и осмысление' },
  { label: 'Сроки' },
  { label: 'Маршрут' },
]

const LAST = steps.length - 1

export default function ClassificationFormPage() {
  const navigate = useNavigate()
  const addCommunication = useCommunicationsStore((s) => s.addCommunication)

  const [step, setStep] = useState(0)
  const [sourceId, setSourceId] = useState<SourceId | null>(null)
  const [initiatorName, setInitiatorName] = useState('Иванов В.А.')
  const [directorate, setDirectorate] = useState('Дирекция по персоналу')
  const [typeId, setTypeId] = useState<CommunicationTypeId | null>(null)
  const [params, setParams] = useState<Partial<ClassificationParams>>({})
  const [title, setTitle] = useState('')
  const [essence, setEssence] = useState('')
  const [keyMessage, setKeyMessage] = useState('')
  const [questions, setQuestions] = useState<ThreeQuestions>({ q1: '', q2: '', q3: '' })
  const [binding, setBinding] = useState<Binding>({ foundation: [], strategy: [], values: [] })
  const [deadline, setDeadline] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [confidentiality, setConfidentiality] = useState<Confidentiality>('internal')
  const [materials, setMaterials] = useState<string[]>([])
  const [extra, setExtra] = useState<ChannelId[]>([])

  const paramsComplete = !!(params.impactScale && params.urgency && params.impactType && params.tone)

  const depth = useMemo(() => (typeId ? determineCascadeDepth(typeId, params) : null), [typeId, params])
  const required = useMemo(() => (typeId ? determineRequiredChannels(typeId, confidentiality) : []), [typeId, confidentiality])
  const extraClean = extra.filter((id) => !required.includes(id))

  const canNext = (() => {
    switch (step) {
      case 0: return !!sourceId && initiatorName.trim().length > 0
      case 1: return !!typeId
      case 2: return paramsComplete
      case 3: return title.trim() && essence.trim() && keyMessage.trim()
      case 4: return !!deadline
      default: return false
    }
  })()

  const selectType = (id: CommunicationTypeId) => {
    setTypeId(id)
    // Для кризисных коммуникаций срочность очевидна — предзаполняем
    if (id === 'crisis' && !params.urgency) setParams((p) => ({ ...p, urgency: 'crisis' }))
  }

  const handleSubmit = () => {
    if (!sourceId || !typeId || !depth || !paramsComplete) return
    addCommunication({
      id: `comm-${Date.now()}`,
      title: title.trim(),
      essence: essence.trim(),
      keyMessage: keyMessage.trim(),
      initiator: { name: initiatorName.trim(), directorate },
      sourceId,
      typeId,
      classification: params as ClassificationParams,
      confidentiality,
      binding,
      questions,
      cascadeDepth: depth.depth,
      depthExtended: depth.extended,
      requiredChannels: required,
      extraChannels: extraClean,
      materials,
      createdAt: new Date().toISOString(),
      deadline: new Date(`${deadline}T12:00:00`).toISOString(),
      status: 'active',
    })
    navigate('/timeline')
  }

  const toggleExtra = (id: ChannelId) => setExtra((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const showAside = typeId && depth && step >= 1 && step < LAST
  const type = typeId ? typeById(typeId) : null

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <Stepper steps={steps} currentStep={step} onStepClick={setStep} />
      </div>

      <div className={showAside ? 'grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]' : ''}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {step === 0 && (
              <StepSource
                sourceId={sourceId}
                onSource={setSourceId}
                initiatorName={initiatorName}
                onInitiatorName={setInitiatorName}
                directorate={directorate}
                onDirectorate={setDirectorate}
              />
            )}
            {step === 1 && <StepType selected={typeId} onSelect={selectType} />}
            {step === 2 && (
              <StepClassification typeId={typeId} params={params} onChange={(k, v) => setParams((p) => ({ ...p, [k]: v }))} />
            )}
            {step === 3 && (
              <StepPassport
                title={title}
                essence={essence}
                keyMessage={keyMessage}
                questions={questions}
                binding={binding}
                onChange={(patch) => {
                  if (patch.title !== undefined) setTitle(patch.title)
                  if (patch.essence !== undefined) setEssence(patch.essence)
                  if (patch.keyMessage !== undefined) setKeyMessage(patch.keyMessage)
                  if (patch.questions) setQuestions(patch.questions)
                  if (patch.binding) setBinding(patch.binding)
                }}
              />
            )}
            {step === 4 && (
              <StepDeadline
                deadline={deadline}
                onDeadline={setDeadline}
                confidentiality={confidentiality}
                onConfidentiality={setConfidentiality}
                materials={materials}
                onMaterials={setMaterials}
              />
            )}
            {step === LAST && typeId && depth && paramsComplete && (
              <StepResult
                typeId={typeId}
                draft={{ title, keyMessage, classification: params as ClassificationParams, deadline: new Date(`${deadline}T12:00:00`).toISOString() }}
                depth={depth.depth}
                depthReason={depth.reason}
                extended={depth.extended}
                required={required}
                extra={extraClean}
                onToggleExtra={toggleExtra}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {showAside && type && depth && (
          <Card className="sticky top-2 hidden lg:block">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Маршрут сейчас</div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
              <span className="text-sm font-medium text-ink">{type.name}</span>
            </div>
            <DepthScale depth={depth.depth} extended={depth.extended} />
            <div className="mt-3 text-sm text-ink-soft">
              До уровня <span className="font-medium text-ink">{levelById(depth.depth).short}</span>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              Обязательных каналов: <span className="font-medium text-ink">{required.length}</span>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft size={16} />
            Назад
          </Button>
        )}
        {step < LAST ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Далее
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            <Send size={16} />
            Запустить каскад
          </Button>
        )}
      </div>
    </div>
  )
}
