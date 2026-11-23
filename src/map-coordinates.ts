import { places, type Place } from './data'
import type { MapCoordinates } from './home-map'

// Facility or representative landmark coordinates from OpenStreetMap contributors, ODbL.
// Area markers: Dohány Street Synagogue for the Jewish Quarter, one point on each promenade/avenue.
export const defaultCoordinates: Partial<Record<string, MapCoordinates>> = {
  's0': [47.502305, 19.034700],
  's1': [47.502012, 19.034211],
  's2': [47.495991, 19.039801],
  's3': [47.498979, 19.043649],
  's4': [47.507050, 19.045919],
  's5': [47.494071, 19.049465],
  's6': [47.500794, 19.054016],
  's7': [47.514166, 19.077838],
  's8': [47.508269, 19.067768],
  's9': [47.486575, 19.058994],
  's10': [47.496102, 19.060868],
  's11': [47.514576, 19.087602],
  's12': [47.518435, 19.082522],
  's13': [47.489066, 19.047800],
  'bath-lukacs': [47.518013, 19.037057],
  'bath-dandar': [47.476378, 19.071104],
  'bath-palatinus': [47.527643, 19.045805],
  'bath-paskal': [47.521663, 19.126977],
  'bath-csillaghegy': [47.584551, 19.040927],
  'bath-veli': [47.519046, 19.036984],
  'bath-gellert': [47.483816, 19.050953],
  'r0': [47.504717, 19.052632],
  'r1': [47.496493, 19.065681],
  'r2': [47.508848, 19.083045],
  'r3': [47.515264, 19.049188],
  'r4': [47.498376, 19.082371],
  'r5': [47.497421, 19.062614],
  'r6': [47.504088, 19.062547],
  'r7': [47.505314, 19.049312],
  'r8': [47.541493, 19.041050],
  'hotel': [47.490414, 19.059137],
}

const defaultQueries = new Map(places.map(place => [place.id, place.map]))

export function mapCoordinates(place: Place): MapCoordinates | undefined {
  const query = place.map.trim()
  const match = query.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)
  if (match) {
    const latitude = Number(match[1])
    const longitude = Number(match[2])
    if (Math.abs(latitude) <= 85 && Math.abs(longitude) <= 180) return [latitude, longitude]
  }
  return defaultQueries.get(place.id) === query ? defaultCoordinates[place.id] : undefined
}
