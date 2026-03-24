const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue'), name: 'login' }],
    meta: {
      title: 'Login',
      guestOnly: true,
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: 'lectures',
        component: () => import('pages/LecturesPage.vue'),
        name: 'lectures',
        meta: {
          title: 'Vorlesungen',
          requiresAuth: true,
        },
      },
      {
        path: 'lectures/details/:id',
        component: () => import('pages/LectureDetails.vue'),
        props: true,
        name: 'lectureDetails',
        meta: {
          title: 'Vorlesungsdetails',
          requiresAuth: true,
        },
      },

      {
        path: 'professors',
        component: () => import('pages/DozenteneinsichtList.vue'),
        name: 'professors',
        meta: {
          title: 'Dozenten',
          requiresAuth: true,
        },
      },
      {
        path: 'professors/details/:id',
        component: () => import('pages/DozenteneinsichtDetails.vue'),
        props: true,
        name: 'professorDetails',
        meta: {
          title: 'Dozentendetails',
          requiresAuth: true,
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
