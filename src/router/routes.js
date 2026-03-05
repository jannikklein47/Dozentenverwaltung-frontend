const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      {
        path: 'lectures',
        component: () => import('pages/LecturesPage.vue'),
        name: 'lectures',
        meta: {
          title: 'Vorlesungen',
        },
      },
      {
        path: 'lectures/details/:id',
        component: () => import('pages/LectureDetails.vue'),
        props: true,
        name: 'lectureDetails',
        meta: {
          title: 'Vorlesungsdetails',
        },
      },

      {
        path: 'professors',
        component: () => import('pages/DozenteneinsichtList.vue'),
        name: 'professors',
        meta: {
          title: 'Dozenten',
        },
      },
      {
        path: 'professors/details/:id',
        component: () => import('pages/DozenteneinsichtDetails.vue'),
        props: true,
        name: 'professorDetails',
        meta: {
          title: 'Dozentendetails',
        },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
