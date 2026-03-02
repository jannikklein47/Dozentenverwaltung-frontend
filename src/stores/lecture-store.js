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

export const useLectureStore = defineStore('lecture', {
  state: () => ({
    lectures: [],
    totalLectures: 0,
    dozentLectures: [],
    totalDozentLectures: 0,
    filters: ref({
      limit: 20,
      offset: 0,
      term: null,
      vorlesung_statusId: null,
      abschluss_typId: null,
      semester: null,
      gehalten_anId: null,
      vorliebeId: null,
    }),
    dozentFilters: ref({
      limit: 20,
      offset: 0,
      term: null,
      vorlesung_statusId: null,
      abschluss_typId: null,
      semester: null,
      gehalten_anId: null,
      vorliebeId: null,
    }),
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
        // request the api with all filters
        const response = await api.get(
          '/app/lectures' +
            `?limit=${this.filters.limit}&offset=${this.filters.offset}&term=${this.filters.term}&vorlesung_statusId=${this.filters.vorlesung_statusId}&abschluss_typId=${this.filters.abschluss_typId}&semester=${this.filters.semester}&gehalten_anId=${this.filters.gehalten_anId}&vorliebeId=${this.filters.vorliebeId}`,
        )

        if (response.status === 200) {
          const lecs = response.data.lectures
          // set total lectures for visual feedback
          this.totalLectures = response.data.total
          // replace all entries after offset with new data
          this.lectures = this.lectures.splice(this.filters.offset, this.lectures.length, ...lecs)
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
        // request the api with all filters
        const response = await api.get(
          '/app/lectures/professor/' +
            id +
            `?limit=${this.dozentFilters.limit}&offset=${this.dozentFilters.offset}&term=${this.dozentFilters.term}&vorlesung_statusId=${this.dozentFilters.vorlesung_statusId}&abschluss_typId=${this.dozentFilters.abschluss_typId}&semester=${this.filters.semester}&gehalten_anId=${this.dozentFilters.gehalten_anId}&vorliebeId=${this.dozentFilters.vorliebeId}`,
        )

        if (response.status === 200) {
          const lecs = response.data.lectures
          // set total lectures for visual feedback
          this.totalDozentLectures = response.data.total
          // replace all entries after offset with new data
          this.dozentLectures = this.dozentLectures.splice(
            this.dozentFilters.offset,
            this.dozentLectures.length,
            ...lecs,
          )
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
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLectureStore, import.meta.hot))
}
