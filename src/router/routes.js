const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue'),
        name: 'login',
        meta: {
          title: 'Login',
          guestOnly: true,
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '/register',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/RegisterPage.vue'),
        name: 'register',
        meta: {
          title: 'Registrierung',
          guestOnly: true,
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: '/initial-password',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ChangeInitialPasswordPage.vue'),
        name: 'initial-password',
        meta: {
          title: 'Passwort Erstellen',
          requiresAuth: true,
          initialPassword: true,
        },
      },
    ],
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
          noInitialPassword: true,
        },
      },

      {
        path: 'lectures',
        component: () => import('pages/LecturesPage.vue'),
        name: 'lectures',
        meta: {
          title: 'Vorlesungen',
          requiresAuth: true,
          noInitialPassword: true,
          filters: true,
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
          noInitialPassword: true,
          filters: true,
        },
      },

      {
        path: 'professors',
        component: () => import('pages/DozenteneinsichtList.vue'),
        name: 'professors',
        meta: {
          title: 'Dozenten',
          requiresAuth: true,
          noInitialPassword: true,
          filters: true,
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
          noInitialPassword: true,
        },
      },
      {
        path: 'users',
        component: () => import('pages/ManageUsersPage.vue'),
        name: 'users',
        meta: {
          title: 'Benutzer Verwalten',
          requiresAuth: true,
          noInitialPassword: true,
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
