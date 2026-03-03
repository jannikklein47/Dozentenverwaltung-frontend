const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: 'vorlesungseinsicht', component: () => import('pages/LecturesPage.vue') },
      {
        path: 'vorlesungseinsicht/details/:id',
        component: () => import('pages/DozentenDetailPage.vue'),
        props: true,
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
