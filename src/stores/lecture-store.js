import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

/*
This is the lecture store to store lectures centralized.
To use it in a component, you need to import it like this:

import { useLectureStore } from 'stores/lecture-store'
const lectureStore = useLectureStore()

To use the professor data in html:
*************** Script ****************
import { computed } from 'vue'

const lectures = computed(() => lectureStore.lectures)
const totalLectures = computed(() => lecutreStore.totalLectures)

*************** HTML ******************
{{ lectures }}
{{ totalLectures }}

***************************************

To load lectures, you need to call the loadLectures() function. It will fetch the lectures
from the backend.
It is async and you are able to await it.

***************************************

To clear the letures, you need to call the clearLectures() function. It will clear the
lectures array and reset the total count. Use this function when filters change, combined with
a call to loadLectures().

***************************************

If you want to access the filters, you can use the filters property.
This is a ref object, so you can use it like this:

const filters = lectureStore.filters

Because it is a reactive ref object, you are able to use the filter properties
directly as v-models.

Utilize the v-directive @update:model-value to call a function that clears the lectures and
loads new lectures. If you use it for a search term, please debounce.

***************************************

*/
const getDefaultLectureFilters = () => ({
  limit: 20,
  offset: 0,
  term: null,
  vorlesung_statusId: null,
  abschluss_typId: null,
  gehalten_anId: null,
  semester: null,
  vorlaufzeit: null,
})

const getDefaultDozentLectureFilters = () => ({
  limit: 20,
  offset: 0,
  term: null,
  vorlesung_statusId: null,
  abschluss_typId: null,
  vorliebeId: null,
  semester: null,
  gehalten_anId: null,
  vorlaufzeit: null,
})


export const useLectureStore = defineStore('lecture', {
  state: () => ({
    lectures: [],
    totalLectures: 0,
    dozentLectures: [],
    totalDozentLectures: 0,
    filters: ref(getDefaultLectureFilters()),
dozentFilters: ref(getDefaultDozentLectureFilters()),
    mappings: {},
  }),

  getters: {},

  actions: {
    /**
     * Load lectures from the API.
     * The function will fetch the lectures with all filters applied.
     * The total lectures will be updated and the lectures array will be replaced after the offset with new data.
     * If the request fails, an error will be logged to the console.
     */
    async loadLectures() {
      try {
        const query =
          '?' +
          Object.entries(this.filters)
            .filter((data) => data[1] !== null && data[1] !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        // request the api with all filters
        const response = await api.get('/app/lectures' + query)

        if (response.status === 200) {
          const lecs = response.data.lectures
          // set total lectures for visual feedback
          this.totalLectures = response.data.total
          // replace all entries after offset with new data
          this.lectures.splice(this.filters.offset, this.lectures.length, ...lecs)
        }
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Load lectures from the API.
     * The function will fetch the lectures with all filters applied.
     * The total lectures will be updated and the lectures array will be replaced after the offset with new data.
     * If the request fails, an error will be logged to the console.
     */
    async loadDozentLectures(id) {
      try {
        const query =
          '?' +
          Object.entries(this.dozentFilters)
            .filter((data) => data[1] !== null && data[1] !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        // request the api with all filters
        const response = await api.get('/app/lectures/professor/' + id + query)

        if (response.status === 200) {
          const lecs = response.data.lectures
          // set total lectures for visual feedback
          this.totalDozentLectures = response.data.total
          // replace all entries after offset with new data
          this.dozentLectures.splice(this.dozentFilters.offset, this.dozentLectures.length, ...lecs)
        }
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Clears the lectures array and resets the total count as well as the offset.
     *
     * Use this function to clear the lectures data when the user changes the filters.
     */
    clearLectures() {
      this.lectures = []
      this.totalLectures = 0
      this.filters.offset = 0
    },

    /**
     * Clears the lectures array and resets the total count as well as the offset.
     *
     * Use this function to clear the lectures data when the user changes the filters.
     */
    clearDozentLectures() {
      this.dozentLectures = []
      this.totalDozentLectures = 0
      this.dozentFilters.offset = 0
    },
resetLectureFilters() {
  Object.assign(this.filters, getDefaultLectureFilters())
  this.lectures = []
  this.totalLectures = 0
},

resetDozentLectureFilters() {
  Object.assign(this.dozentFilters, getDefaultDozentLectureFilters())
  this.dozentLectures = []
  this.totalDozentLectures = 0
},
    /**
     * Retrieves a lecture by their ID.
     * @param {number} id The ID of the lecture to retrieve.
     * @returns {Promise<Professor | null>} A promise that resolves to the lecture if found, or null if not found.
     */
    async getLectureById(id) {
      try {
        const response = await api.get(`/app/lectures/${id}`)
        if (response.status === 200) {
          return response.data.lecture
        } else {
          throw new Error('Lecture not found')
        }
      } catch (error) {
        console.error(error)
        return null
      }
    },

    /**
     * Loads the mappings from the API.
     * The mappings are a list of all possible filter values and their corresponding human-readable names.
     * The function will fetch the mappings and store them in the 'mappings' property.
     * If the request fails, an error will be logged to the console.
     */
    async loadMappings() {
      try {
        const response = await api.get('/app/lectures/mapping')

        if (response.status === 200) {
          Object.entries(response.data).forEach(([key, value]) => {
            this.mappings[key] = value.map((v) => ({ label: v.name, value: v.id }))
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLectureStore, import.meta.hot))
}
