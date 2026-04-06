import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import Stepper from '../components/common/Stepper'
import Button from '../components/common/Button'
import StepPlatform from '../components/classification/StepPlatform'
import StepCommunicationType from '../components/classification/StepCommunicationType'
import StepProperties from '../components/classification/StepProperties'
import StepResult from '../components/classification/StepResult'
import StepConfirm from '../components/classification/StepConfirm'
import { determineCascadeDepth, determineRequiredChannels, isMandatoryCascade } from '../utils/cascadeEngine'
import { useCommunicationsStore } from '../store/communicationsStore'
import type { SourceId, CommunicationTypeId, ClassificationParams } from '../types/communication'

const steps = [
  { label: 'Источник' },
  { label: 'Тип' },
  { label: 'Свойства' },
  { label: 'Результат' },
  { label: 'Отправка' },
]

export default function ClassificationFormPage() {
  const navigate = useNavigate()
  const addCommunication = useCommunicationsStore((s) => s.addCommunication)
  const [currentStep, setCurrentStep] = useState(0)
  const [sourceId, setSourceId] = useState<SourceId | null>(null)
  const [typeId, setTypeId] = useState<CommunicationTypeId | null>(null)
  const [params, setParams] = useState<Partial<ClassificationParams>>({})
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const isParamsComplete = params.impactScale && params.urgency && params.impactType && params.complexity && params.sensitivity

  const calculation = useMemo(() => {
    if (!typeId || !isParamsComplete) return null
    const classification = params as ClassificationParams
    const depth = determineCascadeDepth(typeId, classification)
    const channels = determineRequiredChannels(classification)
    const mandatory = isMandatoryCascade(typeId, classification, depth)
    return { depth, channels, mandatory, classification }
  }, [typeId, params, isParamsComplete])

  const canNext = () => {
    switch (currentStep) {
      case 0: return !!sourceId
      case 1: return !!typeId
      case 2: return !!isParamsComplete
      case 3: return true
      case 4: return title.trim().length > 0
      default: return false
    }
  }

  const handleSubmit = () => {
    if (!sourceId || !typeId || !calculation) return
    addCommunication({
      id: `comm-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      sourceId,
      typeId,
      classification: calculation.classification,
      cascadeDepth: calculation.depth,
      requiredChannels: calculation.channels,
      createdAt: new Date().toISOString(),
      isMandatoryCascade: calculation.mandatory,
      status: 'active',
    })
    navigate('/timeline')
  }

  const handlePropertyChange = (key: keyof ClassificationParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 0 && (
            <StepPlatform selected={sourceId} onSelect={setSourceId} />
          )}
          {currentStep === 1 && (
            <StepCommunicationType selected={typeId} onSelect={setTypeId} />
          )}
          {currentStep === 2 && (
            <StepProperties params={params} onChange={handlePropertyChange} />
          )}
          {currentStep === 3 && calculation && typeId && (
            <StepResult
              typeId={typeId}
              classification={calculation.classification}
              cascadeDepth={calculation.depth}
              requiredChannels={calculation.channels}
              isMandatory={calculation.mandatory}
            />
          )}
          {currentStep === 4 && (
            <StepConfirm
              title={title}
              description={description}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center gap-3">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={() => setCurrentStep((s) => s - 1)}>
            <ArrowLeft size={16} />
            Назад
          </Button>
        )}
        {currentStep < 4 ? (
          <Button onClick={() => setCurrentStep((s) => s + 1)} disabled={!canNext()}>
            Далее
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canNext()}>
            <Send size={16} />
            Отправить на таймлайн
          </Button>
        )}
      </div>
    </div>
  )
}
