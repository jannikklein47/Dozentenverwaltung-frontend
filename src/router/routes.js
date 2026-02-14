const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: 'vorlesungen', component: () => import('pages/LecturesPage.vue') },

      // ÄNDERUNG HIER:
      // Das :id ist der Platzhalter für deine Zahl (z.B. /vorlesungen/details/1)
      {
        path: 'vorlesungen/details/:id',
        component: () => import('pages/DozentenDetailPage.vue'),
        props: true // Sehr wichtig: Reicht die ID direkt als Prop an die Komponente weiter
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes