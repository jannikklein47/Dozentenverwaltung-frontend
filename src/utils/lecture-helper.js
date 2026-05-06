/**
 * Erkennt "Alles" und wertet die Prioritäten des Dozenten aus, falls verfügbar
 */
export const formatPreference = (pref, prof = null) => {
  if (!pref) return 'Alles' // Fallback
  const p = String(pref).toUpperCase()

  if (p === 'A' || p === 'ALLES') {
    if (prof) {
      // Nimmt camelCase oder snake_case an, je nachdem was das Backend liefert
      const prioB = prof.prioBachelor !== undefined ? prof.prioBachelor : prof.prio_bachelor
      const prioM = prof.prioMaster !== undefined ? prof.prioMaster : prof.prio_master

      if (prioB === 1 && prioM === 0) return '1. Bachelor, 2. Master'
      if (prioM === 1 && prioB === 0) return '1. Master, 2. Bachelor'
    }
    return 'Alles'
  }

  if (p === 'B' || p === 'BACHELOR') return 'Bachelor'
  if (p === 'M' || p === 'MASTER') return 'Master'

  return pref
}

export const getVorlaufOptions = () => [
  { label: 'Sofort Bereit', value: 'S' },
  { label: 'Bis 4 Wochen', value: '4' },
  { label: '4 Wochen +', value: 'M' },
]

export const formatVorlaufzeit = (val) => {
  const opt = getVorlaufOptions().find((o) => o.value === val)
  return opt ? opt.label : val || '—'
}

// Farb-Helfer für "Vorlauf"
export const getVorlaufColor = (val) => {
  if (val === 'S') return 'green'
  if (val === '4') return 'orange'
  if (val === 'M') return 'red'
  return 'grey-6'
}

// Farb-Helfer für "Bereits gehalten"
export const getGehaltenColor = (name) => {
  if (!name) return 'grey-6'
  const lowerName = name.toLowerCase()
  if (lowerName.includes('provadis')) return 'blue'
  if (lowerName.includes('extern')) return 'orange'
  return 'grey-6'
}
