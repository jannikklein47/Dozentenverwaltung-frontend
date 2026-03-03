const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: 'lectures', component: () => import('pages/LecturesPage.vue'), name: 'lectures' },
      {
        path: 'lectures/details/:id',
        component: () => import('pages/DozentenDetailPage.vue'),
        props: true,
        name: 'lectureDetails',
      },

      {
        path: 'professors',
        component: () => import('pages/DozenteneinsichtList.vue'),
        name: 'professors',
      },
      {
        path: 'professors/details/:id',
        component: () => import('pages/DozenteneinsichtDetails.vue'),
        props: true,
        name: 'professorDetails',
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
