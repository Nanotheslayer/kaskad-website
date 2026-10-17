import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import type { ChannelId } from '../types/channel'
import { typeById } from '../data/communicationTypes'
import { useCommunicationsStore } from '../store/communicationsStore'
import { useNow } from '../hooks/useNow'
import { deliveryDeadline, determineRequiredChannels } from '../utils/cascadeEngine'
import { assigneesOf } from '../utils/assignments'
import { toggleItem } from '../utils/collections'
import { fmt } from '../utils/format'
import {
  PASSPORT_STEPS,
  createEmptyDraft,
  isStepComplete,
  type PassportDraft,
} from '../components/classification/passportDraft'
import StepSource from '../components/classification/StepSource'
import StepType from '../components/classification/StepType'
import StepPassport from '../components/classification/StepPassport'
import StepAudience from '../components/classification/StepAudience'
import StepResult from '../components/classification/StepResult'
import Stepper from '../components/ui/Stepper'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const LAST_STEP = PASSPORT_STEPS.length - 1

export default function ClassificationFormPage() {
  const navigate = useNavigate()
  const addCommunication = useCommunicationsStore((s) => s.addCommunication)
  const now = useNow()

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(createEmptyDraft)
  const update = (patch: Partial<PassportDraft>) => setDraft((d) => ({ ...d, ...patch }))

  const { typeId } = draft
  const managers = assigneesOf(draft.audience).length
  const required = useMemo(() => (typeId ? determineRequiredChannels(typeId) : []), [typeId])
  // Канал, ставший обязательным после смены типа, не дублируем в дополнительных
  const extra = draft.extraChannels.filter((id) => !required.includes(id))

  const toggleExtra = (id: ChannelId) => update({ extraChannels: toggleItem(draft.extraChannels, id) })

  const submit = () => {
    if (!draft.sourceId || !typeId) return
    addCommunication({
      id: `comm-${Date.now()}`,
      title: draft.title.trim(),
      essence: draft.essence.trim(),
      keyMessage: draft.keyMessage.trim(),
      initiator: { name: draft.initiatorName.trim(), directorate: draft.directorate },
      sourceId: draft.sourceId,
      typeId,
      binding: draft.binding,
      questions: draft.questions,
      requiredChannels: required,
      extraChannels: extra,
      materials: draft.materials,
      audience: draft.audience,
      createdAt: new Date().toISOString(),
    })
    navigate('/timeline')
  }

  const type = typeId ? typeById(typeId) : null
  const showAside = type !== null && step >= 1 && step < LAST_STEP

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <Stepper steps={PASSPORT_STEPS} currentStep={step} onStepClick={setStep} />
      </div>

      <div
        className={
          showAside
            ? 'grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_260px] @7xl:grid-cols-[minmax(0,1fr)_280px]'
            : ''
        }
      >
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
                sourceId={draft.sourceId}
                initiatorName={draft.initiatorName}
                directorate={draft.directorate}
                onChange={update}
              />
            )}
            {step === 1 && <StepType selected={typeId} onSelect={(id) => update({ typeId: id })} />}
            {step === 2 && (
              <StepPassport
                title={draft.title}
                essence={draft.essence}
                keyMessage={draft.keyMessage}
                questions={draft.questions}
                binding={draft.binding}
                onChange={update}
              />
            )}
            {step === 3 && <StepAudience audience={draft.audience} materials={draft.materials} onChange={update} />}
            {step === LAST_STEP && typeId && (
              <StepResult
                typeId={typeId}
                title={draft.title}
                launchAt={now}
                managers={managers}
                required={required}
                extra={extra}
                onToggleExtra={toggleExtra}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {showAside && (
          <Card className="sticky top-2 hidden @5xl:block">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">Маршрут сейчас</div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
              <span className="text-sm font-medium text-ink">{type.name}</span>
            </div>
            <div className="text-sm text-ink-soft">
              Тональность: <span className="font-medium text-ink">{type.tone.toLowerCase()}</span>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              Обязательных каналов: <span className="font-medium text-ink">{required.length}</span>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              Получат задание: <span className="font-medium text-ink">{managers}</span>
            </div>
            <div className="mt-1 text-sm text-ink-soft">
              Довести до:{' '}
              <span className="font-medium text-ink">
                {fmt(deliveryDeadline(type.id, now), type.id === 'crisis' ? 'd MMM, HH:mm' : 'd MMMM')}
              </span>
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
        {step < LAST_STEP ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!isStepComplete(step, draft)}>
            Далее
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={submit}>
            <Send size={16} />
            Запустить каскад
          </Button>
        )}
      </div>
    </div>
  )
}
