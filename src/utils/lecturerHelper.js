//Function for getting the color of the avatar based on the lecturer ID (Deterministic so same ID always gets same color)
export function getAvatarColor(id) {
  if (!id) return '#9a9a9aff' // default color
  const strId = id.toString()
  let hash = 0
  for (let i = 0; i < strId.length; i++) {
    const char = strId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash | 0 // Convert to 32-bit integer
  }
  const colors = [
    '#d32f2f', // red
    '#f57c00', // orange
    '#fbc02d', // yellow (darker)
    '#689f38', // green
    '#00897b', // teal
    '#0288d1', // blue
    '#1976d2', // dark blue
    '#5e35b1', // purple
    '#8e24aa', // deep purple
    '#c2185b', // pink
    '#d84315', // deep orange
    '#6d4c41', // brown
  ]
  return colors[Math.abs(hash) % colors.length]
}

//Function for getting the initials of the lecturer based on first and last name
export function getDozentenInitials(firstName, lastName) {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return firstInitial + lastInitial
}

export function getDozStatusColor(status) {
  //Temporary function until we have the actual status from the backend, then we can adjust it accordingly
  //TODO: adjust the return values
  if (status === 'Intern') return 'light-blue' //Intern
  if (status === 'Extern') return 'brown-7' //Extern
  return 'Unbekannt'
}

//Function for getting the preference array based on its name and priority numbers
export function getPreference(generalPreferenceName, prioBachelor, prioMaster) {
  if (generalPreferenceName === 'Alles') {
    if (prioBachelor === 1 && prioMaster === 1) return ['Keine Präferenz']
    if (prioBachelor === 1 && prioMaster === 0) return ['1. Bachelor', '2. Master']
    if (prioMaster === 1 && prioBachelor === 0) return ['1. Master', '2. Bachelor']
  }
  return [generalPreferenceName]
}
