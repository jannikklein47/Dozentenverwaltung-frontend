import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { ref } from 'vue'

/*
This is the professor store to store professors centralized.
To use it in a component, you need to import it like this:

import { useProfessorStore } from 'stores/professor-store'
const professorStore = useProfessorStore()

To use the professor data in html:
*************** Script ****************
import { computed } from 'vue'

const professors = computed(() => professorStore.professors)
const totalProfessors = computed(() => professorStore.totalProfessors)

*************** HTML ******************
{{ professors }}
{{ totalProfessors }}

***************************************

To load professors, you need to call the loadProfessors() function. It will fetch the professors
from the backend.
It is async and you are able to await it.

***************************************

To clear the professors, you need to call the clearProfessors() function. It will clear the
professors array and reset the total count. Use this function when filters change, combined with
a call to loadProfessors().

***************************************

If you want to access the filters, you can use the filters property.
This is a ref object, so you can use it like this:

const filters = professorStore.filters

Because it is a reactive ref object, you are able to use the filter properties
directly as v-models.

Utilize the v-directive @update:model-value to call a function that clears the professors and
loads new professors. If you use it for a search term, please debounce.

***************************************

*/

export const useProfessorStore = defineStore('professor', {
  state: () => ({
    professors: [],
    totalProfessors: 0,
    filters: ref({
      limit: 20,
      offset: 0,
      term: null,
      dozenten_statusId: null,
      vorliebeId: null,
    }),
  }),

  getters: {},

  actions: {
    /**
     * Load professors from the API.
     * The function will fetch the professors with all filters applied.
     * The total professors will be updated and the professors array will be replaced after the offset with new data.
     * If the request fails, an error will be logged to the console.
     */
    async loadProfessors() {
      try {
        // request the api with all filters
        const response = await api.get(
          '/app/professors' +
            `?limit=${this.filters.limit}&offset=${this.filters.offset}&term=${this.filters.term}&vorliebeId=${this.filters.vorliebeId}&dozenten_statusId=${this.filters.dozenten_statusId}`,
        )

        if (response.status === 200) {
          const profs = response.data.professors
          // set total professors for visual feedback
          this.totalProfessors = response.data.total
          // replace all entries after offset with new data
          this.professors = this.professors.splice(
            this.filters.offset,
            this.professors.length,
            ...profs,
          )
        }
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Clears the professors array and resets the total count as well as the offset.
     *
     * Use this function to clear the professors data when the user changes the filters.
     */
    clearProfessors() {
      this.professors = []
      this.totalProfessors = 0
      this.filters.offset = 0
    },

    /**
     * Retrieves a professor by their ID.
     * @param {number} id The ID of the professor to retrieve.
     * @returns {Promise<Professor | null>} A promise that resolves to the professor if found, or null if not found.
     */
    async getProfessorById(id) {
      try {
        const response = await api.get(`/app/professors/${id}`)
        if (response.status === 200) {
          return response.data.professor
        } else {
          throw new Error('Professor not found')
        }
      } catch (error) {
        console.error(error)
        return null
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfessorStore, import.meta.hot))
}
