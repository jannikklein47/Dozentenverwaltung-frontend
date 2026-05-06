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
