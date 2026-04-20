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
    lectureProfessors: [],
    totalLectureProfessors: 0,
    filters: ref({
      limit: 20,
      offset: 0,
      term: null,
      dozenten_statusId: null,
      vorliebeId: null,
    }),
    lectureFilters: ref({
      limit: 20,
      offset: 0,
      term: null,
      dozenten_statusId: null,
      vorliebeId: null,
    }),
    mappings: {},
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
        const query =
          '?' +
          Object.entries(this.filters)
            .filter((data) => data[1] !== null && data[1] !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')
        // request the api with all filters
        const response = await api.get('/app/professors' + query)

        if (response.status === 200) {
          const profs = response.data.professors
          // set total professors for visual feedback
          this.totalProfessors = response.data.total
          // replace all entries after offset with new data
          this.professors.splice(this.filters.offset, this.professors.length, ...profs)
        }
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Create a new professor using the API.
     * The function will send a POST request to the API with the new professor data.
     * If the request fails, an error will be logged to the console.
     */
    async createProfessor(newProfessor) {
      try {
        const response = await api.post('/app/professors', newProfessor)

        if (response.status === 201) {
          return true
        } else {
          return response.status
        }
      } catch (error) {
        if (error.response?.data?.message) {
          return error.response.data.title + ' | ' + error.response.data.message
        } else {
          return error.message
        }
      }
    },

    /**
     * Load professors from the API.
     * The function will fetch the professors with all filters applied.
     * The total professors will be updated and the professors array will be replaced after the offset with new data.
     * If the request fails, an error will be logged to the console.
     */
    async loadLectureProfessors(id) {
      try {
        // request the api with all filters

        const query =
          '?' +
          Object.entries(this.lectureFilters)
            .filter((data) => data[1] !== null && data[1] !== undefined)
            .map(([key, value]) => `${key}=${value}`)
            .join('&')

        const response = await api.get('/app/professors/lecture/' + id + query)

        if (response.status === 200) {
          const profs = response.data.professors
          // set total professors for visual feedback
          this.totalLectureProfessors = response.data.total
          // replace all entries after offset with new data
          this.lectureProfessors.splice(
            this.lectureFilters.offset,
            this.lectureProfessors.length,
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

    clearLectureProfessors() {
      this.lectureProfessors = []
      this.totalLectureProfessors = 0
      this.lectureFilters.offset = 0
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

    /**
     * Loads the mappings from the API.
     * The function will fetch the mappings and store them in the 'mappings' property.
     * If the request fails, an error will be logged to the console.
     */
    async loadMappings() {
      try {
        const response = await api.get('/app/professors/mapping')

        if (response.status === 200) {
          Object.entries(response.data).forEach(([key, value]) => {
            this.mappings[key] = value.map((v) => ({ label: v.name, value: v.id }))
          })
        }
      } catch (error) {
        console.error(error)
      }
    },

    /**
     * Assigns a lecture to a professor by sending a POST request to the backend API.
     * This creates a new Vorlesung_Dozent join record.
     * The error is re-thrown for the caller to handle UI feedback.
     */
    async assignLectureToProfessor(assignData) {
      try {
        const response = await api.post('/app/professors/assign', assignData)
        return response.data
      } catch (error) {
        console.error('Failed to assign lecture to professor:', error)
        throw error
      }
    },

    /**
     * Removes the assignment between a professor and a lecture by sending a DELETE
     * request to the backend API. This only deletes the Vorlesung_Dozent join record —
     * neither the professor nor the lecture itself is deleted.
     * The error is re-thrown for the caller to handle UI feedback.
     */
    async removeLectureFromProfessor(professorId, lectureId) {
      try {
        const response = await api.delete('/app/professors/assign', {
          params: { professorId, lectureId },
        })
        if (response.status === 200 || response.status === 204) {
          const index = this.lectureProfessors.findIndex((p) => p.id === professorId)
          if (index !== -1) {
            this.lectureProfessors.splice(index, 1)
            this.totalLectureProfessors--
          }
        }
      } catch (error) {
        console.error('Failed to remove lecture assignment:', error)
        throw error
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfessorStore, import.meta.hot))
}
